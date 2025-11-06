import React from 'react';
import { useRouter } from 'next/router';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { FormInput } from '@/components/auth/FormInput';
import { FormButton } from '@/components/auth/FormButton';
import { useAppContext } from '@/context/AppContext';


const SignUpPage: React.FC = () => {
  const router = useRouter();
  const { login } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    login({ name, email });
    router.push('/');
  };

  return (
    <AuthLayout>
        <div className="text-center">
            <h1 className="text-3xl font-bold text-text-primary">Create Account</h1>
            <p className="text-text-muted mt-2">Join CeniMax for an amazing movie experience</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <FormInput
                id="fullName"
                name="fullName"
                type="text"
                label="Full Name"
                placeholder="John Doe"
                autoComplete="name"
                required
            />
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
                autoComplete="new-password"
                required
            />
            <FormButton type="submit">
                Create Account
            </FormButton>
        </form>
        <div className="mt-6 text-center">
            <p className="text-text-muted">
                Already have an account?{' '}
                <button onClick={() => router.push('/login')} className="font-semibold text-text-secondary hover:text-text-primary">
                    Sign In
                </button>
            </p>
        </div>
    </AuthLayout>
  );
};

export default SignUpPage;