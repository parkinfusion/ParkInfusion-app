import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

// Get current user session
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session !== null;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Login with email and password
export const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Errore durante il login' };
  }
};

// Register new user
export const register = async (email: string, password: string, displayName?: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Errore durante la registrazione' };
  }
};

// Logout
export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
};

// Update user profile
export const updateUserProfile = async (updates: { display_name?: string }): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Errore durante l\'aggiornamento del profilo' };
  }
};