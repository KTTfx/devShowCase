import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/auth';
import { DEMO_CREDENTIALS, createDemoUser } from '../lib/demo-user';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const credentials = await createDemoUser();
      await signIn(credentials.email, credentials.password);
      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign in with demo account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-8 border border-primary/10"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4"
            >
              <LogIn className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              Welcome Back
            </h1>
            <p className="text-gray-400 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6"
            >
              <p className="text-red-500 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <input
                {...register('email')}
                type="email"
                placeholder="Email"
                className="w-full bg-background border border-primary/20 rounded-lg px-4 py-3 focus:border-primary/50 transition-colors"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                {...register('password')}
                type="password"
                placeholder="Password"
                className="w-full bg-background border border-primary/20 rounded-lg px-4 py-3 focus:border-primary/50 transition-colors"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="gradient"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-gray-400">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleDemoSignIn}
              disabled={isLoading}
            >
              Try Demo Account
            </Button>
          </form>

          <div className="mt-6 text-center text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}