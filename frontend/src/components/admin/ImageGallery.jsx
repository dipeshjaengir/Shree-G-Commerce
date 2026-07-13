import React from 'react';
import { IoTrashOutline } from 'react-icons/io5';

const ImageGallery = ({
  images = [],
  onDeleteImage,
  canDelete = false,
  className = ''
}) => {
  if (images.length === 0) {
    return (
      <div className="w-full h-32 border border-zinc-200 border-dashed bg-white flex items-center justify-center text-zinc-400 text-xs uppercase tracking-wider font-light">
        No images available
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${className}`}>
      {images.map((src, idx) => (
        <div key={idx} className="bg-white border border-zinc-200 p-2 flex items-center justify-center relative group h-24 overflow-hidden">
          <img src={src} alt="" className="w-full h-full object-cover transition-all duration-300" />
          
          {canDelete && onDeleteImage && (
            <button
              onClick={() => onDeleteImage(src)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              title="Delete Image"
            >
              <IoTrashOutline className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
