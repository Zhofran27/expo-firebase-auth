import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Alert, AppState } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 menit

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const idleTimer = useRef(null);
  const appState = useRef(AppState.currentState);

  const logout = async () => {
    await signOut(auth);
  };

  const handleAutoLogout = async () => {
    Alert.alert('Sesi Berakhir', 'Anda tidak aktif selama 5 menit. Silakan login kembali.');
    await logout();
  };

  const resetIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(handleAutoLogout, IDLE_TIMEOUT);
  };

  // Monitor AppState
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        if (user) resetIdleTimer();
      }
      appState.current = nextState;
    });
    return () => subscription.remove();
  }, [user]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const token = await u.getIdToken();
        await SecureStore.setItemAsync('auth_token', token);
        resetIdleTimer();
      } else {
        if (idleTimer.current) clearTimeout(idleTimer.current);
      }
      setLoading(false);
    });
    return () => {
      unsub();
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout, resetIdleTimer }}>
      {children}
    </AuthContext.Provider>
  );
}