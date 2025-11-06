import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    const router = useRouter();

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 animate-fade-in-slow">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-40 dark:opacity-20"
                style={{ backgroundImage: `url(https://i.ibb.co/pPpwM0B/9xe-EGUZjgi-Kl-I69jw-IOi0hj-KUIk.jpg)` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-background-primary/50 to-background-primary" />
            
            <button 
                onClick={() => router.back()} 
                className="absolute top-6 left-6 z-20 flex items-center text-text-secondary hover:text-white font-semibold transition-colors duration-300 group"
            >
                <ArrowLeftIcon className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                Back
            </button>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-background-secondary/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <Link href="/" className="flex justify-center mb-6 text-4xl font-black tracking-wide text-white w-full">
                        CeniMax
                    </Link>
                    {children}
                </div>
            </div>
        </div>
    );
};
