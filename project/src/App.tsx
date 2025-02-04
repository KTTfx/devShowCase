import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/home';
import { SubmitProject } from './pages/submit-project';
import { SignIn } from './pages/sign-in';
import { SignUp } from './pages/sign-up';
import { Dashboard } from './pages/dashboard';
import { Navbar } from './components/navbar';
import { ToastContainer } from './components/ui/toast';
import { AuthProvider, useAuth } from './contexts/auth';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/submit" element={
                <PrivateRoute>
                  <SubmitProject />
                </PrivateRoute>
              } />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
            </Routes>
          </div>
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
}