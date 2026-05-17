import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selamat Datang!</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutBtnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA', justifyContent: 'center', alignItems: 'center', padding: 24 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', color: '#1A1A2E', marginBottom: 8 },
  email: { fontSize: 15, color: '#666', marginBottom: 40 },
  logoutBtn: {
    backgroundColor: '#FDECEA',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderWidth: 1.5,
    borderColor: '#E74C3C',
  },
  logoutBtnText: { color: '#E74C3C', fontSize: 15, fontWeight: '700' },
});