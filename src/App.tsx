import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { checkAuth, setAuthChecked } from './features/auth/authSlice'; // ← CHANGE 1: Import setAuthChecked
import { LoginPage } from './features/auth/LoginPage';
import { Layout } from './components/layout/Layout';
import { routes, RouteKey } from './routes/Router';

function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, isChecking } = useAppSelector((state) => state.auth); // ← CHANGE 2: Add isChecking
  const [currentRoute, setCurrentRoute] = useState<RouteKey>('dashboard');

  // ← CHANGE 3: Update useEffect to handle auth checking
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
          // Token exists, verify with backend
          await dispatch(checkAuth()).unwrap();
        } else {
          // No token, mark checking as complete
          dispatch(setAuthChecked());
        }
      } catch (error) {
        // Auth check failed, mark checking as complete
        dispatch(setAuthChecked());
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const route = Object.entries(routes).find(([_, r]) => r.path === path);
      if (route) {
        setCurrentRoute(route[0] as RouteKey);
      }
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState();

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleNavigation = (e: Event) => {
      e.preventDefault();
      const target = e.target as HTMLAnchorElement;
      const href = target.getAttribute('href');
      if (href) {
        const route = Object.entries(routes).find(([_, r]) => r.path === href);
        if (route) {
          setCurrentRoute(route[0] as RouteKey);
          window.history.pushState({}, '', href);
        }
      }
    };

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.getAttribute('href')?.startsWith('/')) {
        handleNavigation(e);
      }
    });
  }, []);

  const handleNavigate = (route: RouteKey) => {
    setCurrentRoute(route);
  };

  // ← CHANGE 4: Show loading screen while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading screen during login/logout actions
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const CurrentComponent = routes[currentRoute].component;

  return (
    <Layout currentRoute={currentRoute} onNavigate={handleNavigate}>
      <CurrentComponent />
    </Layout>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;