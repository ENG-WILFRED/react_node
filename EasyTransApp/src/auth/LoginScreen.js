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

const LoginScreen = () => {
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
      Alert.alert('Success', 'You are now logged in');
    } catch (error) {
      setLoading(false);
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };

  return (
    <LinearGradient colors={['#6a11cb', '#2575fc']} className="flex-1">
      <KeyboardAvoidingView
        className="flex-1 px-6 justify-center"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text className="text-4xl text-white mb-10 font-bold text-center">Welcome Back</Text>

        <View className="flex-row items-center bg-white/20 rounded-xl mb-5 px-3">
          <Icon name="email" size={20} color="#666" style={{ marginRight: 8 }} />
          <TextInput
            className="flex-1 h-12 text-white"
            placeholder="Email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="flex-row items-center bg-white/20 rounded-xl mb-5 px-3">
          <Icon name="lock" size={20} color="#666" style={{ marginRight: 8 }} />
          <TextInput
            className="flex-1 h-12 text-white"
            placeholder="Password"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          className="bg-white py-3.5 rounded-xl items-center mt-5"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#2575fc" />
          ) : (
            <Text className="text-blue-600 text-base font-bold">Login</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default LoginScreen;
