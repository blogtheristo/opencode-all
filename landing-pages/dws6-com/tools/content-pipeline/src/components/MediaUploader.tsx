import { useRef, useState, useCallback } from 'react';
import type { MediaAttachment } from '../types';

interface MediaUploaderProps {
  media: MediaAttachment[];
  onAdd: (file: File) => void;
  onRemove: (mediaId: string) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function MediaUploader({ media, onAdd, onRemove }: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      Array.from(files).forEach((file) => {
        if (file.size > 10 * 1024 * 1024) {
          alert(`File "${file.name}" is too large (max 10MB for localStorage).`);
          return;
        }
        onAdd(file);
      });
    },
    [onAdd]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          dragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-700 hover:border-gray-600'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-3xl mb-2">📎</div>
        <p className="text-sm text-gray-400">
          Drop files here or <span className="text-blue-400">browse</span>
        </p>
        <p className="text-xs text-gray-600 mt-1">Images, PDFs, videos up to 10MB</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,application/pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Media grid */}
      {media.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {media.map((m) => (
            <div
              key={m.id}
              className="relative group bg-gray-800 rounded-lg overflow-hidden border border-gray-700/50"
            >
              {/* Preview */}
              {m.mimeType.startsWith('image/') ? (
                <img
                  src={m.dataUrl}
                  alt={m.name}
                  className="w-full h-32 object-cover cursor-pointer"
                  onClick={() => setPreview(m.dataUrl)}
                />
              ) : (
                <div className="w-full h-32 flex items-center justify-center bg-gray-900">
                  <span className="text-3xl">
                    {m.mimeType.includes('pdf') ? '📄' : m.mimeType.startsWith('video/') ? '🎬' : '📎'}
                  </span>
                </div>
              )}

              {/* Info overlay */}
              <div className="p-2">
                <p className="text-xs text-gray-300 truncate">{m.name}</p>
                <p className="text-[10px] text-gray-600">{formatSize(m.size)}</p>
              </div>

              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(m.id);
                }}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600/80 text-white
                           text-xs flex items-center justify-center opacity-0 group-hover:opacity-100
                           transition-opacity hover:bg-red-500"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox preview */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8"
          onClick={() => setPreview(null)}
        >
          <img
            src={preview}
            alt="Preview"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            onClick={() => setPreview(null)}
          >
            X
          </button>
        </div>
      )}
    </div>
  );
}
