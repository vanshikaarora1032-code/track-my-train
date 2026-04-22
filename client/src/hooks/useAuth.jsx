import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';
import api from '../lib/axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setUser(session.user);
        localStorage.setItem('auth_token', session.access_token);
      } else {
        setUser(null);
        localStorage.removeItem('auth_token');
      }
      setLoading(false);
    };

    checkUser();

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        localStorage.setItem('auth_token', session.access_token);
      } else {
        setUser(null);
        localStorage.removeItem('auth_token');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    // Development Bypass
    if (trimmedEmail === 'guest' || trimmedEmail === 'admin') {
      const mockUser = {
        id: 'mock-user-id',
        email: `${trimmedEmail}@example.com`,
        user_metadata: { full_name: 'Guest Traveler' }
      };
      setUser(mockUser);
      localStorage.setItem('auth_token', 'mock-token');
      return { user: mockUser };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const register = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const forgotPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset`,
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
