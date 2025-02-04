import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, LogIn, UserPlus, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/auth';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-primary/10"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 20 }}
              className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center"
            >
              <Terminal className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              DevShowcase
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <motion.div
                    className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-sm font-medium text-primary">
                      {user.email?.[0].toUpperCase()}
                    </span>
                  </motion.div>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="group"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="group"
                  >
                    <LogIn className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="gradient"
                    size="sm"
                    className="group"
                  >
                    <UserPlus className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                    <span className="hidden sm:inline">Sign Up</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}