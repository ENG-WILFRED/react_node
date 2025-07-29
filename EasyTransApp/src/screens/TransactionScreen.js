import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import TransactionCard from '../components/TransactionCard';
import SectionHeader from '../components/SectionHeader';
import { createTransaction, fetchTransactions } from '../utils/api'; // assume these exist
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';

export default function TransactionScreen() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // New transaction state
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await fetchTransactions(); // your utils/api.js
      setTransactions(res);
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error loading transactions' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!amount || !description) {
      Alert.alert('Validation', 'Please provide both amount and description');
      return;
    }

    setCreating(true);
    try {
      const newTx = await createTransaction({ amount, description });
      setTransactions(prev => [newTx, ...prev]);
      setAmount('');
      setDescription('');
      Toast.show({ type: 'success', text1: 'Transaction created!' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to create transaction' });
    } finally {
      setCreating(false);
    }
  };

  const filtered = transactions.filter(tx =>
    tx.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <SectionHeader title="Transactions" />

      {/* Create transaction form */}
      <View style={styles.form}>
        <TextInput
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createText}>Create Transaction</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search transactions..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#333" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <TransactionCard transaction={item} />}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Download Button */}
      <TouchableOpacity style={styles.exportButton}>
        <Text style={styles.exportText}>Download PDF</Text>
      </TouchableOpacity>

      {/* Spinner Overlay */}
      <Spinner visible={creating} textContent="Creating..." textStyle={{ color: '#fff' }} />

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  exportButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  exportText: { color: 'white', fontWeight: 'bold' },

  form: {
    marginBottom: 20,
    paddingVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
  },
  createButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
