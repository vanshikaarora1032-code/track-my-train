import { supabaseAdmin } from '../lib/supabaseAdmin.js';

export const register = async (req, res) => {
  const { email, password, full_name } = req.body;
  if (!email || !password || !full_name) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        data: { full_name }
      }
    });

    if (error) throw error;
    res.status(201).json({ message: 'Account created!', user: data.user });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(400).json({ message: error.message || 'Registration failed' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    res.status(200).json({ message: 'Logged in!', session: data.session });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(401).json({ message: error.message || 'Invalid credentials' });
  }
};

export const logout = async (req, res) => {
  try {
    const { error } = await supabaseAdmin.auth.signOut();
    if (error) throw error;
    res.status(200).json({ message: 'Logged out!' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/reset'
    });

    if (error) throw error;
    res.status(200).json({ message: 'Code sent to your email!' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(400).json({ message: error.message || 'User not found' });
  }
};

export const getMe = async (req, res) => {
  // User is attached to req.user by authMiddleware
  res.status(200).json({ user: req.user });
};
