import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from '@/context/AppContext';
import { ArrowLeftIcon } from '@/components/icons/ArrowLeftIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { AvatarModal } from '@/components/AvatarModal';
import { mockAvatars } from '@/constants';

const SettingsCard: React.FC<{title: string, description: string, buttonText: string, onButtonClick?: () => void}> = ({title, description, buttonText, onButtonClick}) => (
    <div className="bg-white dark:bg-background-secondary p-6 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-text-primary">{title}</h3>
            <p className="text-gray-600 dark:text-text-muted mt-1 text-sm">{description}</p>
        </div>
        <button
          onClick={onButtonClick}
          className="mt-4 sm:mt-0 flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-background-tertiary dark:text-text-secondary dark:hover:bg-opacity-70 transition-colors duration-300"
        >
            {buttonText}
        </button>
    </div>
);


const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { userProfile, setUserProfile, theme, toggleTheme, logout, isAuthenticated } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
        router.replace('/login');
    }
  }, [isAuthenticated, router]);

  const handleAvatarSelect = (url: string) => {
    setUserProfile(prev => prev ? ({ ...prev, avatarUrl: url }) : null);
    setIsModalOpen(false);
  };

  const handleRemoveAvatar = () => {
    const newAvatar = mockAvatars[Math.floor(Math.random() * mockAvatars.length)];
    setUserProfile(prev => prev ? ({ ...prev, avatarUrl: newAvatar }) : null);
    setIsModalOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleAvatarSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  }

  if (!userProfile || !isAuthenticated) {
    return null; // Render nothing while redirecting
  }

  return (
    <>
    <AvatarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectAvatar={handleAvatarSelect}
        onRemoveAvatar={handleRemoveAvatar}
        currentAvatar={userProfile.avatarUrl}
        onUploadClick={() => fileInputRef.current?.click()}
    />
    <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
    />
    <div className="animate-fade-in container mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-24">
        <div className="max-w-4xl mx-auto">
            <button onClick={() => router.back()} className="flex items-center text-gray-800 dark:text-text-secondary hover:text-black dark:hover:text-white font-semibold transition-colors duration-300 group mb-8">
                <ArrowLeftIcon className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                Back
            </button>

            {/* Profile Header */}
            <div className="flex flex-col items-center text-center mb-12">
                <div className="relative group">
                    <img
                        src={userProfile.avatarUrl}
                        alt="User Avatar"
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-white dark:ring-background-tertiary shadow-lg"
                    />
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="absolute inset-0 w-full h-full bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                       <EditIcon className="w-8 h-8"/>
                    </button>
                </div>
                <h1 className="text-4xl font-bold mt-4 text-gray-900 dark:text-text-primary">{userProfile.name}</h1>
                <p className="text-gray-500 dark:text-text-muted mt-1">{userProfile.email}</p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-6">Account Settings</h2>
                    <div className="space-y-4">
                        <SettingsCard
                            title="Email Address"
                            description={`Your email is ${userProfile.email}`}
                            buttonText="Change"
                        />
                        <SettingsCard
                            title="Password"
                            description="Last changed 6 months ago"
                            buttonText="Change"
                        />
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-6">Preferences</h2>
                    <div className="space-y-4">
                        <SettingsCard
                            title="Theme"
                            description={`Currently using ${theme === 'dark' ? 'Dark' : 'Light'} Mode`}
                            buttonText={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'}`}
                            onButtonClick={toggleTheme}
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-background-tertiary">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left p-4 rounded-lg text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-semibold transition-colors duration-300"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    </div>
    </>
  );
};

export default ProfilePage;