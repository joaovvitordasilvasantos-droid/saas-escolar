import React from 'react';

export default function DeleteConfirmation({ isOpen, onConfirm, onCancel, title = "Confirmar Exclusão", message = "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.", loading = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass border border-outline/30 rounded-[2rem] shadow-glow-strong w-full max-w-md overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-error/10 text-error flex items-center justify-center mx-auto shadow-glow">
             <span className="material-symbols-outlined text-[32px]">warning</span>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-outfit font-black text-on-surface tracking-tight">{title}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {message}
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button 
              onClick={onConfirm}
              disabled={loading}
              className="w-full py-4 bg-error text-white rounded-2xl font-black text-sm shadow-glow active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                  Confirmar Exclusão
                </>
              )}
            </button>
            <button 
              onClick={onCancel}
              disabled={loading}
              className="w-full py-4 bg-surface-container border border-outline/50 rounded-2xl font-black text-on-surface text-sm hover:bg-surface-container-high active:scale-95 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
