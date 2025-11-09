import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import SubmissionForm from './components/SubmissionForm';
import AdminDashboard from './components/AdminDashboard';
import PublicSubmissionView from './components/PublicSubmissionView';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0, // Don't retry mutations by default
      onError: (error: any) => {
        console.error('[React Query Mutation Error]', error);
      },
    },
  },
});

function App() {
  const [view, setView] = useState<'public' | 'admin' | 'submission'>(() => {
    // Check URL for view on load
    const path = window.location.pathname;
    if (path.includes('/admin')) return 'admin';
    if (path.includes('/submission/')) return 'submission';
    return 'public';
  });

  useEffect(() => {
    // Listen for URL changes
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('/admin')) setView('admin');
      else if (path.includes('/submission/')) setView('submission');
      else setView('public');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (view === 'submission') {
    return (
      <QueryClientProvider client={queryClient}>
        <PublicSubmissionView />
      </QueryClientProvider>
    );
  }

  if (view === 'admin') {
    return (
      <QueryClientProvider client={queryClient}>
        <AdminDashboard />
        <button
          onClick={() => {
            setView('public');
            window.history.pushState({}, '', '/');
          }}
          className="fixed bottom-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700"
        >
          ← Back to Submit
        </button>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-blue-600 mb-2">DealerTrade</h1>
            <p className="text-xl text-gray-700">Get the best price for your vehicle</p>
          </header>
          <SubmissionForm />
        </div>

        {/* Admin Link */}
        <button
          onClick={() => {
            setView('admin');
            window.history.pushState({}, '', '/admin');
          }}
          className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-900 text-sm"
        >
          Admin View →
        </button>
      </div>
    </QueryClientProvider>
  );
}

export default App;
