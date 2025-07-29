import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const SignUpScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const { email, password, confirmPassword, firstName, lastName } = form;

    if (!email || !password || !firstName || !lastName) {
      return Toast.show({ type: 'error', text1: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return Toast.show({ type: 'error', text1: 'Passwords do not match' });
    }

    setLoading(true);

    try {
      await axios.post('http://<YOUR_BACKEND>/auth/signup', {
        email,
        password,
        firstName,
        lastName,
      });

      Toast.show({
        type: 'success',
        text1: 'Account created!',
        text2: 'Check your email for OTP',
      });

      navigation.navigate('OtpScreen', { email });

    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: err?.response?.data?.message || 'Try again later',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={(text) => handleChange('firstName', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={(text) => handleChange('lastName', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={(text) => handleChange('email', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => handleChange('password', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={(text) => handleChange('confirmPassword', text)}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.switchText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#f2f2f2',
    marginBottom: 15,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3D5AFE',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  switchText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#3D5AFE',
  },
});
