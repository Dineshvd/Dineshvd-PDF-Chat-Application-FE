import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import Button from './Button';
import { cn } from '../../lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  isUploading = false,
  accept = '.pdf',
  maxSize = 10, // Default 10MB
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    
    // Check file type
    if (!file.name.endsWith('.pdf')) {
      setError('Only PDF files are accepted');
      return;
    }
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }
    
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn('flex flex-col space-y-4', className)}>
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          dragActive ? 'border-primary bg-primary/5' : 'border-gray-300',
          error ? 'border-red-500' : ''
        )}
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload
            className={cn(
              'h-10 w-10 mb-2',
              error ? 'text-red-500' : 'text-gray-400'
            )}
          />
          
          {selectedFile ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{selectedFile.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <p className="text-base font-medium">
                Drag and drop your PDF file here or click to browse
              </p>
              <p className="text-xs text-gray-500">
                Supports PDF files up to {maxSize}MB
              </p>
            </>
          )}
          
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
      </div>
      
      {selectedFile && (
        <Button
          onClick={handleUploadClick}
          isLoading={isUploading}
          disabled={isUploading || !!error}
          className="w-full"
        >
          {isUploading ? 'Uploading...' : 'Upload PDF'}
        </Button>
      )}
    </div>
  );
};

export default FileUpload;