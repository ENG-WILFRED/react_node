// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
  ToastAndroid,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TransactionCard from '../components/TransactionCard';
import { getTransactions, logoutUser } from '../services/api';
import Icon from 'react-native-vector-icons/Ionicons';

// Enable layout animation on Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const loadTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      ToastAndroid.show('Failed to load transactions', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigation.replace('Login');
  };

  const handleToggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowDropdown(!showDropdown);
  };

  const handleProfile = () => {
    setShowDropdown(false);
    navigation.navigate('Profile');
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>EasyTrans</Text>

        <View style={styles.navTabs}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={[styles.tab, styles.activeTab]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.tab}>Transactions</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleToggleDropdown} style={styles.profileButton}>
          <Icon name="person-circle-outline" size={32} color="#333" />
        </TouchableOpacity>
      </View>

      {showDropdown && (
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={handleProfile}>
            <Text style={styles.dropdownItem}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.dropdownItem}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Body */}
      <Text style={styles.title}>Welcome back 👋</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#00A8E8" />
      ) : (
        <FlatList
          data={transactions}
          renderItem={({ item }) => <TransactionCard transaction={item} />}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 16, backgroundColor: '#f4f6f8' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  navTabs: {
    flexDirection: 'row',
    gap: 15,
  },
  tab: {
    fontSize: 16,
    color: '#555',
  },
  activeTab: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 4,
  },
  dropdown: {
    position: 'absolute',
    top: 90,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    zIndex: 100,
  },
  dropdownItem: {
    padding: 12,
    fontSize: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
});
