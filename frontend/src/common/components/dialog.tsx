import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'default' | 'large' | 'full';
}

export const Dialog = ({ isOpen, onClose, title, children, size = 'default' }: DialogProps) => {
  // Determine max width based on size prop
  const maxWidthClass = {
    default: 'max-w-lg',
    large: 'max-w-3xl',
    full: 'max-w-5xl',
  }[size];

  // Close on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', onKeyDown);
      // Prevent scrolling when dialog is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity p-4 sm:p-6"
      onClick={onClose}
      style={{ animation: 'fadeIn 0.2s ease-out' }}>
      <div
        className={`bg-white rounded-lg shadow-lg w-full ${maxWidthClass} max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'scaleIn 0.2s ease-out' }}>
        {title && (
          <div className="flex items-center justify-between p-4 sm:p-6 border-b">
            <h2 className="text-lg font-medium text-gray-800">{title}</h2>
          </div>
        )}

        <div className="flex-1 overflow-auto p-4 sm:p-6">{children}</div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>,
    document.body,
  );
};
