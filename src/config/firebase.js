import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDzDYdLvEf2_TXEfOyYXW2aPttTLNIhB_M',
  authDomain: 'expo-firebase-auth-7de48.firebaseapp.com',
  projectId: 'expo-firebase-auth-7de48',
  storageBucket: 'expo-firebase-auth-7de48.firebasestorage.app',
  messagingSenderId: '139531875988',
  appId: '1:139531875988:web:3a18fc83dd0def58df6681',
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default app;