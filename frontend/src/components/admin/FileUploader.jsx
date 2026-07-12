import React, { useState } from 'react';
import { IoCloudUploadOutline, IoCloseOutline } from 'react-icons/io5';

const FileUploader = ({
  onChange,
  multiple = false,
  label = 'Upload Image Files',
  accept = 'image/*',
  maxSizeMB = 5
}) => {
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Check sizes
    const validFiles = files.filter(file => {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        alert(`File "${file.name}" exceeds the maximum size limit of ${maxSizeMB}MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Generate previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    
    if (multiple) {
      setPreviews(prev => [...prev, ...newPreviews]);
      if (onChange) onChange([...validFiles]);
    } else {
      setPreviews([newPreviews[0]]);
      if (onChange) onChange(validFiles[0]);
    }
  };

  const removePreview = (idx) => {
    setPreviews(prev => prev.filter((_, i) => i !== idx));
    // Reset file input value
  };

  return (
    <div className="space-y-4">
      <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-light">
        {label}
      </span>
      
      {/* Upload Dropzone Area */}
      <div className="relative border-2 border-dashed border-zinc-200 hover:border-black transition-colors bg-white p-6 text-center cursor-pointer flex flex-col items-center justify-center gap-2">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <IoCloudUploadOutline className="w-8 h-8 text-zinc-400" />
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wider">Drag files here or click to upload</p>
          <p className="text-[10px] text-zinc-400 font-light">PNG, JPG, WEBP formats up to {maxSizeMB}MB</p>
        </div>
      </div>

      {/* Previews lists */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-2">
          {previews.map((src, idx) => (
            <div key={idx} className="w-16 h-16 border border-zinc-200 bg-white p-1 relative flex items-center justify-center shrink-0">
              <img src={src} alt="" className="w-full h-full object-cover grayscale" />
              <button
                type="button"
                onClick={() => removePreview(idx)}
                className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center absolute -top-1.5 -right-1.5 shadow-md hover:bg-zinc-800"
              >
                <IoCloseOutline className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
