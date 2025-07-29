import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { resendVerification } from '../../api/auth/resendVerification';
import { forgotPassword } from '../../api/auth/forgotPassword';
import { resetPassword } from '../../api/auth/resetPassword';

const OtpScreen = ({ route }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const inputs = useRef([]);
  const email = route?.params?.email || '';

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleSubmit = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 4) {
      Alert.alert('Incomplete OTP', 'Please enter all 4 digits');
      return;
    }
    setLoading(true);
    try {
      // Example: Call resetPassword API with OTP and email
      await resetPassword({ email, otp: fullOtp });
      Alert.alert('Success', 'OTP Verified and password reset!');
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Invalid OTP');
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await resendVerification({ email });
      Alert.alert('OTP Sent', 'A new OTP has been sent to your email');
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to resend OTP');
    }
    setResendLoading(false);
  };

  const handleForgotPassword = async () => {
    setForgotLoading(true);
    try {
      await forgotPassword({ email });
      Alert.alert('Sent', 'Password reset instructions sent to your email');
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to send reset instructions');
    }
    setForgotLoading(false);
  };

  return (
    <LinearGradient colors={['#6a11cb', '#2575fc']} className="flex-1">
      <KeyboardAvoidingView
        className="flex-1 px-6 justify-center items-center"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text className="text-2xl text-white font-bold mb-2">Enter OTP</Text>
        <Text className="text-base text-gray-200 mb-8 text-center">
          We sent a 4-digit code to your email {email ? `(${email})` : ''}
        </Text>

        <View className="flex-row justify-between w-4/5 mb-8">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputs.current[index] = ref)}
              className="w-12 h-12 bg-white/20 text-white text-xl rounded-lg text-center mx-1"
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={text => handleChange(text, index)}
              autoFocus={index === 0}
              placeholder="•"
              placeholderTextColor="#ccc"
            />
          ))}
        </View>

        <TouchableOpacity
          className="bg-white py-3 px-20 rounded-xl items-center"
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#2575fc" />
          ) : (
            <Text className="text-blue-600 text-base font-bold">Verify</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-between w-full mt-6 px-4">
          <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
            <Text className="text-white underline">
              {resendLoading ? 'Resending...' : 'Resend Code'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleForgotPassword} disabled={forgotLoading}>
            <Text className="text-white underline">
              {forgotLoading ? 'Sending...' : 'Forgot Password?'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default OtpScreen;