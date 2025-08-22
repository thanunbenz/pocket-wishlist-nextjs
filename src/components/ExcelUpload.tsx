'use client';

import { useState, useRef } from 'react';
import { Upload, X, AlertCircle, Check, FileSpreadsheet, Download } from 'lucide-react';
import { PokemonCard } from '@/types/pokemon';
import { addToWishlist } from '@/lib/wishlist';
import { createExcelTemplate } from '@/lib/excel-template';

interface ExcelUploadProps {
  onClose: () => void;
  onUploadComplete: () => void;
}

export default function ExcelUpload({ onClose, onUploadComplete }: ExcelUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
        setError('Please upload an Excel file (.xlsx or .xls)');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setErrors([]);
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setErrors([]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/wishlist/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details && Array.isArray(data.details)) {
          setErrors(data.details);
          setError(`${data.error} (${data.validItems || 0} valid items found)`);
        } else {
          setError(data.error || 'Upload failed');
        }
        return;
      }

      // Add items to wishlist
      let addedCount = 0;
      for (const card of data.items) {
        try {
          addToWishlist(card as PokemonCard);
          addedCount++;
        } catch (err) {
          console.error('Failed to add card to wishlist:', err);
        }
      }

      setUploadedCount(addedCount);
      setSuccess(true);
      onUploadComplete();
    } catch (err) {
      setError('Failed to upload file');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (!droppedFile.name.match(/\.(xlsx|xls)$/)) {
        setError('Please upload an Excel file (.xlsx or .xls)');
        return;
      }
      setFile(droppedFile);
      setError(null);
      setErrors([]);
      setSuccess(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Upload Excel Wishlist</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!success ? (
          <>
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                Excel file should contain columns: Set, Number, Pokemon/Name, Rarity, Packs (comma-separated)
              </p>
              <button
                onClick={createExcelTemplate}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                Download template
              </button>
            </div>

            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {file ? (
                <div>
                  <FileSpreadsheet className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">
                    Click or drag Excel file here
                  </p>
                </>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 rounded flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p>{error}</p>
                  {errors.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {errors.slice(0, 5).map((err, i) => (
                        <li key={i} className="text-xs">{err}</li>
                      ))}
                      {errors.length > 5 && (
                        <li className="text-xs">...and {errors.length - 5} more errors</li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload'
                )}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-lg font-medium mb-1">Upload Successful!</p>
            <p className="text-sm text-gray-600">
              Added {uploadedCount} cards to your wishlist
            </p>
            <button
              onClick={onClose}
              className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}