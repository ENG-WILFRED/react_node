import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {fetchTransactionById} from '../../api/transactions/fetchById';
import {updateTransaction} from '../../api/transactions/update';
import {deleteTransaction} from '../../api/transactions/delete';
import {downloadReceipt} from '../../api/transactions/downloadReceipt';

export default function TransactionCard({transaction, token, onUpdate}) {
  const {id, amount, status, date, description} = transaction;
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const res = await fetchTransactionById(id, token);
      Alert.alert('Transaction Details', JSON.stringify(res.data, null, 2));
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch transaction');
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const newStatus = status === 'success' ? 'pending' : 'success';
      await updateTransaction(id, {status: newStatus}, token);
      Alert.alert('Updated', `Status changed to ${newStatus}`);
      if (onUpdate) onUpdate();
    } catch (err) {
      Alert.alert('Error', 'Failed to update transaction');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await deleteTransaction(id, token);
              Alert.alert('Deleted', 'Transaction deleted');
              if (onUpdate) onUpdate();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete transaction');
            }
            setLoading(false);
          },
        },
      ],
    );
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      await downloadReceipt(id, token);
      Alert.alert(
        'Downloaded',
        'Receipt downloaded (see your downloads folder)',
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to download receipt');
    }
    setLoading(false);
  };

  return (
    <View className="bg-gray-50 p-4 mb-3 rounded-xl shadow flex-col">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="font-semibold text-base text-gray-800">
          {description}
        </Text>
        <Text
          className={`font-bold text-base ${
            status === 'success' ? 'text-green-600' : 'text-orange-500'
          }`}>
          KES {amount}
        </Text>
      </View>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xs text-gray-500">
          {new Date(date).toDateString()}
        </Text>
        <Text
          className={`text-xs font-bold ${
            status === 'success' ? 'text-green-600' : 'text-orange-500'
          }`}>
          {status.toUpperCase()}
        </Text>
      </View>
      <View className="flex-row justify-end space-x-4 mt-2">
        <TouchableOpacity onPress={handleFetch} disabled={loading}>
          <Icon name="info" size={22} color="#2563eb" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleUpdate} disabled={loading}>
          <Icon name="edit" size={22} color="#f59e42" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDownload} disabled={loading}>
          <Icon name="file-download" size={22} color="#10b981" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} disabled={loading}>
          <Icon name="delete" size={22} color="#ef4444" />
        </TouchableOpacity>
        {loading && (
          <ActivityIndicator
            size="small"
            color="#2563eb"
            style={{marginLeft: 8}}
          />
        )}
      </View>
    </View>
  );
}
