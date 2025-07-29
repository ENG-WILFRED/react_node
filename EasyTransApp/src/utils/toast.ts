// src/utils/helpers/toast.js
import Toast from 'react-native-toast-message';

export const showToast = (type: string, message: string) => {
  Toast.show({
    type,
    text1: message,
    position: 'bottom',
    visibilityTime: 3000,
  });
};

// Example: showToast("success", "Login successful")
