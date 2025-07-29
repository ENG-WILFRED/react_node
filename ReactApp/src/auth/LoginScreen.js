import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import { login } from '../../api/auth/login';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation', 'Email and Password are required');
      return;
    }

    try {
      setLoading(true);
      const response = await login({ email, password });
      const { token } = response.data;

      // Decode token to get user id
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      // Store token and userId
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', userId);

      setLoading(false);
      Alert.alert('Success', 'You are now logged in');
      navigation.replace('Home');
    } catch (error) {
      setLoading(false);
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };

  return (
    <LinearGradient colors={['#6a11cb', '#2575fc']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={{ fontSize: 32, color: '#fff', marginBottom: 40, fontWeight: 'bold', textAlign: 'center' }}>Welcome Back</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, marginBottom: 20, paddingHorizontal: 12 }}>
          <Icon name="email" size={20} color="#666" style={{ marginRight: 8 }} />
          <TextInput
            style={{ flex: 1, height: 48, color: '#fff' }}
            placeholder="Email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, marginBottom: 20, paddingHorizontal: 12 }}>
          <Icon name="lock" size={20} color="#666" style={{ marginRight: 8 }} />
          <TextInput
            style={{ flex: 1, height: 48, color: '#fff' }}
            placeholder="Password"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={{ backgroundColor: '#fff', paddingVertical: 14, borderRadius: 16, alignItems: 'center', marginTop: 20 }}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#2575fc" />
          ) : (
            <Text style={{ color: '#2575fc', fontSize: 16, fontWeight: 'bold' }}>Login</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default LoginScreen;
