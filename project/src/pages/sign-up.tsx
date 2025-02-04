import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/auth';

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await signUp(data.email, data.password, data.fullName, data.username);
      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign up');
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
              <UserPlus className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              Create Account
            </h1>
            <p className="text-gray-400 mt-2">Join the developer community</p>
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
                {...register('fullName')}
                type="text"
                placeholder="Full Name"
                className="w-full bg-background border border-primary/20 rounded-lg px-4 py-3 focus:border-primary/50 transition-colors"
                disabled={isLoading}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <input
                {...register('username')}
                type="text"
                placeholder="Username"
                className="w-full bg-background border border-primary/20 rounded-lg px-4 py-3 focus:border-primary/50 transition-colors"
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

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
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center text-gray-400">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}