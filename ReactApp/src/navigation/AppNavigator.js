import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../auth/LoginScreen';
import SignUpScreen from '../auth/SignupScreen';
import OtpScreen from '../auth/OTPScreen';
import ProfileScreen from '../screens/profile';
import TransactionScreen from '../screens/TransactionScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignUpScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Transactions" component={TransactionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
