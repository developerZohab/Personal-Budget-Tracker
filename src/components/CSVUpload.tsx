import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import type { Transaction, TransactionCategory } from '../types';
import { Button } from './ui/Button';

interface CSVUploadProps {
  onUpload: (transactions: Transaction[]) => void;
  onCancel: () => void;
}

export function CSVUpload({ onUpload, onCancel }: CSVUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Transaction[]>([]);
  const [parsed, setParsed] = useState<Transaction[]>([]);
  const fileInputId = 'csv-upload';

  const validateCategory = (category: string): TransactionCategory => {
    const validCategories: TransactionCategory[] = [
      'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
      'Bills & Utilities', 'Healthcare', 'Education', 'Travel',
      'Investment', 'Salary', 'Freelance', 'Business', 'Other'
    ];
    
    const found = validCategories.find(c => 
      c.toLowerCase() === category.toLowerCase()
    );
    
    return found || 'Other';
  };

  const parseCSV = (text: string): Transaction[] => {
    const lines = text.trim().split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length < 2) return [];

    // Detect delimiter: comma, semicolon, or tab
    const firstLine = lines[0];
    const delimiterCandidates: Array<'\t' | ';' | ','> = ['\t', ';', ','];
    const delimiter = delimiterCandidates.reduce((best, cand) => {
      const count = firstLine.split(cand).length;
      const bestCount = firstLine.split(best).length;
      return count > bestCount ? cand : best;
    }, ',');

    const splitLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++; // skip escaped quote
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === delimiter && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result.map(v => v.replace(/^"|"$/g, ''));
    };

    const rawHeaders = splitLine(firstLine).map(h => h.trim().toLowerCase());
    const normalizeHeader = (h: string): string => {
      const header = h.replace(/\s+/g, ' ').trim();
      if (header.includes('date')) return 'date';
      if (header.includes('descr') || header.includes('details') || header.includes('memo') || header.includes('payee')) return 'description';
      if (header.includes('amount')) return 'amount';
      if (header.includes('debit') || header.includes('withdraw')) return 'debit';
      if (header.includes('credit') || header.includes('deposit') || header.includes('inflow')) return 'credit';
      if (header.includes('outflow')) return 'debit';
      if (header.includes('category')) return 'category';
      if (header === 'type') return 'type';
      return header;
    };
    const headers = rawHeaders.map(normalizeHeader);

    const parseCurrency = (value: string): number => {
      const cleaned = (value || '')
        .replace(/[^0-9.,()-]/g, '') // remove non-numeric except common symbols
        .replace(/,(?=\d{3}(\D|$))/g, '') // remove thousands commas
        .replace(/\s/g, '');
      // Handle parentheses for negative values
      const isNegative = /^\(.*\)$/.test(cleaned);
      const numeric = parseFloat(cleaned.replace(/[()]/g, '').replace(/,/g, ''));
      if (isNaN(numeric)) return NaN;
      return isNegative ? -numeric : numeric;
    };

    const transactions: Transaction[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = splitLine(lines[i]);
      if (values.length === 0) continue;
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = (values[index] ?? '').trim();
      });

      try {
        const dateStr = row.date || row['transaction date'] || row['posted date'];
        const description = row.description || 'Imported Transaction';
        const hasAmount = typeof row.amount === 'string' && row.amount !== '';
        let amount = hasAmount ? parseCurrency(row.amount) : NaN;
        if (isNaN(amount)) {
          const debit = parseCurrency(row.debit);
          const credit = parseCurrency(row.credit);
          const outflow = parseCurrency(row.outflow);
          const inflow = parseCurrency(row.inflow);
          if (!isNaN(debit) || !isNaN(credit)) {
            amount = (isNaN(credit) ? 0 : credit) - (isNaN(debit) ? 0 : debit);
          } else if (!isNaN(outflow) || !isNaN(inflow)) {
            amount = (isNaN(inflow) ? 0 : inflow) - (isNaN(outflow) ? 0 : outflow);
          }
        }

        if (isNaN(amount) || amount === 0) {
          throw new Error('Invalid or zero amount');
        }

        const rawType = (row.type || '').toLowerCase();
        const type: 'income' | 'expense' = rawType
          ? (rawType.includes('debit') || rawType.includes('expense') || rawType.includes('outflow') ? 'expense' : 'income')
          : (amount < 0 ? 'expense' : 'income');

        const category = validateCategory(row.category || 'Other');
        const normalizedAmount = Math.abs(amount);

        const transaction: Transaction = {
          id: `csv-${Date.now()}-${i}`,
          date: dateStr,
          description,
          amount: normalizedAmount,
          category,
          type
        };

        if (!isValidDate(transaction.date)) {
          throw new Error(`Invalid date: ${transaction.date}`);
        }

        transactions.push(transaction);
      } catch (err) {
        console.warn(`Skipping row ${i + 1}:`, err);
      }
    }

    return transactions;
  };

  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const text = await file.text();
      const transactions = parseCSV(text);
      
      if (transactions.length === 0) {
        throw new Error('No valid transactions found in the CSV file');
      }

      setParsed(transactions);
      setPreview(transactions.slice(0, 5)); // Show first 5 for preview
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleConfirmUpload = () => {
    if (parsed.length > 0) {
      onUpload(parsed);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Import CSV File</h3>
        <p className="text-slate-600">Upload a CSV file with your transaction data</p>
      </div>

      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center transition-colors
          ${isDragOver
            ? 'border-emerald-400 bg-emerald-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-slate-300 hover:border-slate-400'
          }
        `}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => document.getElementById(fileInputId)?.click()}
      >
        <div className="space-y-4">
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
            error ? 'bg-red-100' : 'bg-slate-100'
          }`}>
            {isProcessing ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-600 border-t-transparent" />
            ) : error ? (
              <AlertCircle className="w-6 h-6 text-red-600" />
            ) : (
              <Upload className="w-6 h-6 text-slate-600" />
            )}
          </div>
          
          {error ? (
            <div>
              <p className="text-red-600 font-medium">Upload Failed</p>
              <p className="text-sm text-red-500 mt-1">{error}</p>
            </div>
          ) : (
            <div>
              <p className="text-slate-700 font-medium">
                Drop your CSV file here, or click to browse
              </p>
              <p className="text-sm text-slate-500 mt-1">
                File should contain: Date, Description, Amount, Category (optional)
              </p>
            </div>
          )}
          
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
            id={fileInputId}
          />
          <label htmlFor={fileInputId}>
            <Button variant="outline" className="cursor-pointer">
              Select File
            </Button>
          </label>
        </div>
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h4 className="font-semibold text-slate-800">Preview ({preview.length} transactions)</h4>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4 space-y-2 max-h-40 overflow-y-auto">
            {preview.map((transaction, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-medium">{transaction.description}</span>
                  <span className="text-slate-500 ml-2">• {transaction.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">{transaction.date}</span>
                  <span className={`font-semibold ${
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={handleConfirmUpload}
          disabled={parsed.length === 0}
          className="flex-1"
        >
          Import {parsed.length} Transactions
        </Button>
      </div>

      {/* Format Help */}
      <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
        <p className="font-medium mb-2">CSV Format Requirements:</p>
        <ul className="space-y-1">
          <li>• Headers: Date, Description, Amount, Category (optional)</li>
          <li>• Date format: YYYY-MM-DD (e.g., 2024-01-15)</li>
          <li>• Amount: Positive for income, negative for expenses</li>
          <li>• Category: Will default to "Other" if not provided</li>
        </ul>
      </div>
    </div>
  );
}