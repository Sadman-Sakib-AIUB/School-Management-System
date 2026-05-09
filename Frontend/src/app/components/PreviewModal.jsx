import React from 'react';
import { X } from 'lucide-react';

const PreviewModal = ({ isOpen, onClose, book }) => {
  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="bg-white rounded-3xl w-full max-w-6xl h-[85vh] overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <button
            onClick={onClose}
            className="p-3 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-800 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
          >
            <X size={24} />
          </button>
        </div>

        <iframe
          src={book.link.replace("/view", "/preview")}
          title="PDF Preview"
          className="w-full h-full border-none"
        />
      </div>
    </div>
  );
};

export default PreviewModal;
