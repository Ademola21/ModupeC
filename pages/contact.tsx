import React from 'react';
import { StaticPageLayout } from '@/components/StaticPageLayout';
import { FormInput } from '@/components/auth/FormInput';
import { FormButton } from '@/components/auth/FormButton';

const ContactUsPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle form submission here.
    alert('Thank you for your message! We will get back to you shortly.');
  };

  return (
    <StaticPageLayout title="Contact Us">
        <p className="mb-8">
            Have a question, feedback, or a partnership inquiry? We'd love to hear from you. Fill out the form below or email us directly at <a href="mailto:support@cenimax.com" className="font-semibold text-gray-800 dark:text-gray-200 underline hover:no-underline">support@cenimax.com</a>. Our team typically responds within 24-48 business hours.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white dark:bg-background-secondary p-8 rounded-lg shadow-md">
            <FormInput 
                id="contact-name"
                name="name"
                type="text"
                label="Full Name"
                placeholder="John Doe"
                required
            />
            <FormInput 
                id="contact-email"
                name="email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                required
            />
             <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-2">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    required
                    className="w-full bg-gray-100 dark:bg-background-tertiary/80 border-2 border-transparent rounded-lg py-3 px-4 text-black dark:text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white transition-all duration-300"
                />
            </div>
            <div className="pt-2">
                 <FormButton type="submit">
                    Send Message
                </FormButton>
            </div>
        </form>
    </StaticPageLayout>
  );
};

export default ContactUsPage;