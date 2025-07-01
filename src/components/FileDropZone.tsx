import React, { useCallback, useState } from 'react';

type FileDropZoneProps = {
  onFileSelect: (file: File) => void;
  accept?: string; // e.g. '.xlsx,.xls'
  multiple?: boolean;
  label?: string;
};

const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFileSelect,
  accept = '.xlsx,.xls',
  multiple = false,
  label = 'Drag & drop your file here, or click to select',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (!files.length) return;

      const validFiles = Array.from(files).filter((file) =>
        accept.split(',').map(s => s.trim()).includes(file.name.slice(file.name.lastIndexOf('.')))
      );

      if (validFiles.length === 0) {
        setError(`Only files of type ${accept} are allowed.`);
        return;
      }
      setError(null);
      onFileSelect(multiple ? validFiles[0] : validFiles[0]);
    },
    [accept, multiple, onFileSelect]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    setError(null);
    onFileSelect(multiple ? files[0] : files[0]);
  };

  return (
    <div>
      <label
        htmlFor="file-upload"
        className={`flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition
          ${isDragging ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'}
          hover:border-blue-400`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          id="file-upload"
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleFileInputChange}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 text-blue-500 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 16v-4a3 3 0 016 0v4m2 0v1a3 3 0 01-3 3H8a3 3 0 01-3-3v-1m8-5H7"
          />
        </svg>
        <p className="text-sm text-gray-600">{label}</p>
      </label>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default FileDropZone;
