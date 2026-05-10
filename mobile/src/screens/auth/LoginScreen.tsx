import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        await login(response.data.user, response.data.token);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>PlotBuddy</Text>
        <Text style={styles.tagline}>Welcome back! Sign in to continue.</Text>
      </View>

      <View style={styles.form}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <Text style={styles.label}>Email Address</Text>
        <TextInput 
          style={styles.input}
          placeholder="email@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input}
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  header: { marginTop: 60, marginBottom: 40 },
  logo: { fontSize: 32, fontWeight: '900', color: '#1c1917' },
  tagline: { fontSize: 16, color: '#78716c', marginTop: 8 },
  form: { flex: 1 },
  label: { fontSize: 14, fontWeight: '700', color: '#444', marginBottom: 8 },
  input: { 
    backgroundColor: '#f5f5f4', 
    borderRadius: 12, 
    padding: 16, 
    fontSize: 16, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e7e5e4'
  },
  button: { 
    backgroundColor: '#1c1917', 
    borderRadius: 12, 
    padding: 18, 
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  errorText: { color: '#dc2626', marginBottom: 20, fontWeight: '600' }
});
