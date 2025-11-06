import React, { useEffect } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { mockAvatars } from '../constants';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAvatar: (url: string) => void;
  onRemoveAvatar: () => void;
  onUploadClick: () => void;
  currentAvatar: string;
}

export const AvatarModal: React.FC<AvatarModalProps> = ({
  isOpen,
  onClose,
  onSelectAvatar,
  onRemoveAvatar,
  onUploadClick,
  currentAvatar,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-background-secondary rounded-2xl w-full max-w-lg shadow-2xl border border-white/10 flex flex-col animate-fade-in"
        style={{ animationDuration: '300ms' }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-text-primary">Change Profile Picture</h2>
          <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                 <button onClick={onUploadClick} className="w-full text-center px-5 py-3 rounded-full text-sm font-semibold bg-white text-black hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105">
                    Upload Photo
                </button>
                 <button onClick={onRemoveAvatar} className="w-full text-center px-5 py-3 rounded-full text-sm font-semibold bg-background-tertiary text-text-secondary hover:bg-opacity-70 transition-colors duration-300">
                    Remove Photo
                </button>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-text-secondary tracking-wider uppercase mb-4">Or select an avatar</h3>
                <div className="grid grid-cols-5 gap-4">
                    {mockAvatars.map((avatarUrl) => (
                        <button 
                            key={avatarUrl} 
                            onClick={() => onSelectAvatar(avatarUrl)}
                            className={`aspect-square rounded-full overflow-hidden focus:outline-none ring-2 ring-offset-2 ring-offset-background-secondary transition-all duration-200 ${
                                currentAvatar === avatarUrl ? 'ring-white scale-110' : 'ring-transparent hover:ring-white/50'
                            }`}
                        >
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover"/>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
