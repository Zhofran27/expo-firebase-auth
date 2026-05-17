import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { auth } from '../config/firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await SecureStore.setItemAsync('saved_email', email);
      await SecureStore.setItemAsync('saved_password', password);
    } catch (e) {
      Alert.alert('Login Gagal', e.message);
    }
  };

  const handleBiometric = async () => {
    const savedEmail = await SecureStore.getItemAsync('saved_email');
    const savedPassword = await SecureStore.getItemAsync('saved_password');

    if (!savedEmail || !savedPassword) {
      Alert.alert('Belum ada session', 'Silakan login dulu dengan password.');
      return;
    }

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert('Tidak Didukung', 'Perangkat tidak mendukung biometric.');
      return;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      Alert.alert('Belum Terdaftar', 'Biometric belum diaktifkan di perangkat.');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login dengan biometric',
      fallbackLabel: 'Gunakan password',
    });

    if (result.success) {
      try {
        await signInWithEmailAndPassword(auth, savedEmail, savedPassword);
      } catch (e) {
        Alert.alert('Gagal', e.message);
      }
    } else {
      Alert.alert('Gagal', 'Biometric tidak cocok.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Selamat Datang</Text>
          <Text style={styles.subtitle}>Masuk ke akun Anda</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="nama@email.com"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan password"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotBtn}
          >
            <Text style={styles.forgotText}>Lupa password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={handleLogin}>
            <Text style={styles.btnText}>Masuk</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.biometricBtn} onPress={handleBiometric}>
            <Text style={styles.biometricText}>Login dengan Biometric</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Belum punya akun? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Daftar sekarang</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F5F6FA' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  headerContainer: { alignItems: 'center', marginBottom: 32 },
  logo: { fontSize: 56, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#1A1A2E', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#666' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  forgotBtn: { alignSelf: 'flex-end', marginTop: 8 },
  forgotText: { fontSize: 13, color: '#6C63FF', fontWeight: '600' },
  btn: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  biometricBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#6C63FF',
  },
  biometricText: { color: '#6C63FF', fontSize: 15, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  footerText: { color: '#666', fontSize: 14 },
  linkText: { color: '#6C63FF', fontSize: 14, fontWeight: '700' },
});