import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', isDestructive = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
        <div className={`p-4 sm:p-6 border-b border-border flex items-center gap-3 ${isDestructive ? 'bg-danger/5' : 'bg-primary/5'}`}>
          <div className={`p-2 rounded-xl ${isDestructive ? 'bg-danger/20 text-danger' : 'bg-primary/20 text-primary'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-white">{title}</h3>
          <button onClick={onCancel} className="ml-auto text-text-muted hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6 text-text-muted leading-relaxed">
          {message}
        </div>
        <div className="p-4 sm:p-6 border-t border-border flex justify-end gap-3 bg-background/50">
          <button 
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl font-bold bg-card border border-border hover:bg-background hover:text-white text-text-muted transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl font-bold text-white transition-all shadow-lg ${
              isDestructive 
                ? 'bg-danger hover:bg-red-600 shadow-danger/25' 
                : 'bg-primary hover:bg-primary-hover shadow-primary/25'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
