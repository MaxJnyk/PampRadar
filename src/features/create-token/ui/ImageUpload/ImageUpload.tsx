import React, { useState, useCallback, memo } from 'react';
import './ImageUpload.css';

interface ImageUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

/**
 * Компонент загрузки изображения с drag & drop
 */
export const ImageUpload: React.FC<ImageUploadProps> = memo(({ value, onChange, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileChange(files[0]);
    }
  }, []);

  const handleFileChange = useCallback((file: File) => {
    onChange(file);
    
    // Создаем preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileChange(files[0]);
    }
  }, [handleFileChange]);

  return (
    <div className="image-upload">
      <div
        className={`image-upload-zone ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
            <button
              type="button"
              className="image-remove"
              onClick={() => {
                onChange(null);
                setPreview(null);
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="image-upload-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p className="upload-title">Upload an image</p>
            <p className="upload-subtitle">Drag and drop an image here</p>
            <p className="upload-subtitle">or click the button to select from your PC</p>
            <p className="upload-info">Allowed file types: JPG, PNG, GIF, SVG</p>
            <p className="upload-info">Maximum file size: 5 Mb</p>
            <label className="upload-button">
              Select the file
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/svg+xml"
                onChange={handleFileInputChange}
                hidden
              />
            </label>
          </div>
        )}
      </div>
      {error && <p className="image-upload-error">{error}</p>}
    </div>
  );
});

ImageUpload.displayName = 'ImageUpload';
