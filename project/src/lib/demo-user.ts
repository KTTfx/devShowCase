import { supabase } from './supabase';

export const DEMO_CREDENTIALS = {
  email: 'demo@example.com',
  password: 'demo123456',
};

export async function createDemoUser() {
  const { email, password } = DEMO_CREDENTIALS;
  
  try {
    // Try to create the user first
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: 'Demo User',
          username: 'demouser',
        },
      },
    });

    // If user already exists or we created them successfully, try to sign in
    if (signUpError?.message === 'User already registered' || user) {
      const { data: { user: signedInUser }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !signedInUser) {
        throw new Error('Failed to sign in with demo account');
      }

      return DEMO_CREDENTIALS;
    }

    if (signUpError) {
      throw new Error('Failed to create demo user');
    }

    return DEMO_CREDENTIALS;
  } catch (error) {
    console.error('Error with demo user:', error);
    throw error;
  }
}