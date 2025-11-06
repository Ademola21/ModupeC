import React from 'react';
import { useRouter } from 'next/router';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { FormInput } from '@/components/auth/FormInput';
import { FormButton } from '@/components/auth/FormButton';
import { useAppContext } from '@/context/AppContext';

const LoginPage: React.FC = () => {
    const router = useRouter();
    const { login } = useAppContext();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email') as string;
        // For simulation, we'll use a default name.
        login({ name: 'Alex Doe', email });
        router.push('/');
    };

  return (
    <AuthLayout>
        <div className="text-center">
            <h1 className="text-3xl font-bold text-text-primary">Welcome Back</h1>
            <p className="text-text-muted mt-2">Sign in to continue to CeniMax</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <FormInput
                id="email"
                name="email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                autoComplete="email"
                required
            />
            <FormInput
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
            />
            <div className="text-right">
                <a href="#" className="text-sm font-medium text-text-tertiary hover:text-text-primary">
                    Forgot password?
                </a>
            </div>
            <FormButton type="submit">
                Sign In
            </FormButton>
        </form>
        <div className="mt-6 text-center">
            <p className="text-text-muted">
                Don't have an account?{' '}
                <button onClick={() => router.push('/signup')} className="font-semibold text-text-secondary hover:text-text-primary">
                    Sign Up
                </button>
            </p>
        </div>
    </AuthLayout>
  );
};

export default LoginPage;