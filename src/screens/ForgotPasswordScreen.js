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
} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Sukses', 'Email reset password telah dikirim.');
    } catch (e) {
      Alert.alert('Gagal', e.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Lupa Password?</Text>
        <Text style={styles.subtitle}>
          Masukkan email Anda, kami akan kirimkan link reset password.
        </Text>

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

          <TouchableOpacity style={styles.btn} onPress={handleReset}>
            <Text style={styles.btnText}>Kirim Link Reset</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.backText}>← Kembali ke Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F5F6FA' },
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  emoji: { fontSize: 56, textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 26, fontWeight: '800', color: '#1A1A2E', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 21, marginBottom: 28 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 24,
  },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6 },
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
  btn: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  backText: { color: '#6C63FF', fontSize: 14, fontWeight: '600', textAlign: 'center' },
});