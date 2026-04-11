import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';
import { fetchWithAuth } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const syncUserWithBackend = async (retryCount = 0) => {
    try {
      console.log(`🔄 Syncing user with backend (Attempt ${retryCount + 1})...`);
      const response = await fetchWithAuth('/api/users/sync', {
        method: 'POST',
      });

      if (!response.ok) {
        if (response.status === 401 && retryCount < 2) {
          console.warn('⚠️ Sync failed with 401, retrying after delay...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          return syncUserWithBackend(retryCount + 1);
        }
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Backend Sync Failed:', errorData);
        throw new Error(errorData.message || 'Unable to sync your account with the backend.');
      }
      console.log('✅ Backend identification successful.');
    } catch (error) {
      console.error('🌐 Network/Sync Error:', error.message);
      throw new Error(`Sync Error: ${error.message}`);
    }
  };

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await syncUserWithBackend();
    return result;
  };

  const signup = async (name, email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    await syncUserWithBackend();
    return result;
  };

  const logout = () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      loading,
      isAuthenticated: !!user,
      uid: user?.uid
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
