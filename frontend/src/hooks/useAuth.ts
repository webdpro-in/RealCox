import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  phone?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  role: 'admin' | 'company' | 'buyer' | 'seller' | 'affiliate';
  avatar_url?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  is_verified: boolean;
  aadhaar_name?: string;
  is_aadhaar_verified?: boolean;
  is_phone_verified?: boolean;
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // For demo purposes, set loading to false
    // In a real implementation, you would check for stored auth tokens
    setLoading(false);
  }, []);

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    // Mock implementation for demo
    return { data: null };
  };

  return {
    user,
    session,
    profile,
    loading,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
    isCompany: profile?.role === 'company',
    isBuyer: profile?.role === 'buyer',
    isSeller: profile?.role === 'seller',
    isAffiliate: profile?.role === 'affiliate',
    isAdmin: profile?.role === 'admin'
  };
};