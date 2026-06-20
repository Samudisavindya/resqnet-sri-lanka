import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabaseClient';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string, organization?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setUser(data);
    } else {
      // Create default profile for new users
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const newUser = {
          id: userId,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name || 'User',
          role: 'coordinator' as const,
          organization: authUser.user_metadata?.organization
        };
        await supabase.from('users').insert(newUser);
        setUser(newUser);
      }
    }
    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
    return {};
  };

  const signUp = async (email: string, password: string, fullName: string, organization?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          organization: organization || ''
        }
      }
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      // Create user profile in users table
      const newUser = {
        id: data.user.id,
        email: email,
        full_name: fullName,
        role: 'coordinator' as const,
        organization: organization || null
      };

      const { error: profileError } = await supabase
        .from('users')
        .insert(newUser);

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // Still return success as auth user was created
      }
    }

    return {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
