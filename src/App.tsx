import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import Library from './pages/Library';
import Upload from './pages/Upload';
import Downloads from './pages/Downloads';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import { useStore } from './hooks/use-store';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { user, isAuthLoading } = useStore();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4" />
        <p className="text-cyan-500/50 text-[10px] font-black uppercase tracking-widest">Syncing with vault...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { accentColor, fontFamily, login, logout, setAuthLoading } = useStore();
  const location = useLocation();

  useEffect(() => {
    setAuthLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            login({
              id: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || 'Scholar',
              email: firebaseUser.email!,
              role: userData.role || 'member',
              avatar: userData.avatar || firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`
            });
          } else {
            // Fallback for unexpected cases where user exists in Auth but not in Firestore
            login({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Scholar',
              email: firebaseUser.email!,
              role: 'member',
              avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          logout();
        }
      } else {
        logout();
      }
    });

    return () => unsubscribe();
  }, [login, logout, setAuthLoading]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accentColor);
    document.documentElement.style.setProperty('--font-family', `var(--font-${fontFamily})`);
  }, [accentColor, fontFamily]);

  return (
    <div className="min-h-screen selection:bg-cyan-500/30 bg-slate-950">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/auth" element={<Auth />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
            <Route path="/downloads" element={<ProtectedRoute><Downloads /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute roles={['admin', 'librarian']}>
                  <Admin />
                </ProtectedRoute>
              } 
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      
      <Toaster 
        theme="dark" 
        position="top-center" 
        richColors 
        closeButton 
        toastOptions={{
          style: {
            background: '#0f172a',
            border: '1px solid #1e293b',
            color: '#fff',
            borderRadius: '16px',
          }
        }}
      />
    </div>
  );
}

export default App;