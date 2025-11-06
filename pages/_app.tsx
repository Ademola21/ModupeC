import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { AppProvider } from '@/context/AppContext';
import { ToastProvider } from '@/components/ToastNotifications';
import { Layout } from '@/components/Layout';
import '@/styles/globals.css';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'auto';
    }

    const handleStart = () => {
      NProgress.start();
      setIsNavigating(true);
    };
    
    const handleComplete = () => {
      NProgress.done();
      setIsNavigating(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <AppProvider>
      <ToastProvider>
        <Layout>
          <div style={{ opacity: isNavigating ? 0 : 1, transition: 'opacity 0.15s ease-in-out' }}>
            <Component {...pageProps} />
          </div>
        </Layout>
      </ToastProvider>
    </AppProvider>
  );
}

export default MyApp;
