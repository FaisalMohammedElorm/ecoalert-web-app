import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    // Check onboarding status from localStorage
    const onboarding = localStorage.getItem('eco_onboarding');
    setHasSeenOnboarding(onboarding === 'true');

    // Set a timeout to prevent indefinite loading (max 5 seconds)
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    // Subscribe to Firebase Auth state changes
    const unsubscribe = authService.onAuthStateChanged((firebaseUser) => {
      clearTimeout(timeout);
      setUser(firebaseUser);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    const result = await authService.login(email, password);
    if (result.success) {
      setUser(result.user);
    }
    setIsLoading(false);
    return result;
  };

  const signup = async (email, password, name, phone) => {
    setIsLoading(true);
    try {
      const result = await authService.signup(email, password, name, phone);
      if (result.success) {
        setUser(result.user);
      }
      setIsLoading(false);
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return { success: false, error: 'Signup failed' };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    const result = await authService.logout();
    if (result.success) {
      setUser(null);
      localStorage.removeItem('eco_onboarding'); // Clear onboarding on logout
    }
    setIsLoading(false);
    return result;
  };

  const updateProfile = async (data) => {
    const result = await authService.updateUserProfile(data);
    if (result.success) {
      // Re-fetch user data
      const updatedUser = await authService.getCurrentUser();
      setUser(updatedUser);
    }
    return result;
  };

  const completeOnboarding = () => {
    localStorage.setItem('eco_onboarding', 'true');
    setHasSeenOnboarding(true);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        hasSeenOnboarding, 
        login, 
        signup, 
        logout, 
        updateProfile,
        completeOnboarding 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
