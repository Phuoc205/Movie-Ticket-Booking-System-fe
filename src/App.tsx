import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Dashboard from './pages/Dashboard';
import Staff from './pages/Staff';
import History from './pages/History';

import Header from './components/Header';

// ProtectedRoute Component
const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element; allowedRoles?: string[] }) => {
  const auth = useContext(AuthContext);

  if (auth?.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && auth.user && !allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Toaster position="top-right" reverseOrder={false} />
        <div className="pt-[72px]"> {/* Content wrapper to offset fixed Header */}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movie/:id" element={<MovieDetails />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Staff Routes */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
                <Staff />
              </ProtectedRoute>
            }
          />

          {/* User History */}
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
