import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { expenseApi } from '../services/api';
import { logout, getUsername } from '../services/auth';
import { Expense, ExpenseFormData } from '../types/expense';

export default function HomeScreen({ navigation }: any) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsernameState] = useState('');

  const loadExpenses = async () => {
    try {
      const user = await getUsername();
      if (user) {
        setUsernameState(user);
        const data = await expenseApi.getAll(user);
        setExpenses(data);
      }
    } catch (error) {
      Alert.alert('エラー', '経費データの取得に失敗しました');
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadExpenses();
    setRefreshing(false);
  }, []);

  const handleSubmit = async () => {
    if (!title || !amount) {
      Alert.alert('エラー', 'タイトルと金額を入力してください');
      return;
    }

    setLoading(true);
    try {
      const data: ExpenseFormData = {
        title,
        amount: parseInt(amount),
      };
      await expenseApi.create(data, username);
      setTitle('');
      setAmount('');
      await loadExpenses();
      Alert.alert('成功', '経費を申請しました');
    } catch (error) {
      Alert.alert('エラー', '経費の申請に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return '#34C759';
      case 'REJECTED':
        return '#FF3B30';
      default:
        return '#FF9500';
    }
  };

  const renderItem = ({ item }: { item: Expense }) => (
    <View
      style={styles.expenseItem}
      testID={`expense-item-${item.title}`}
      accessibilityLabel={`expense-item-${item.title}`}
    >
      <View style={styles.expenseHeader}>
        <Text
          style={styles.expenseTitle}
          testID={`expense-title-${item.id}`}
          accessibilityLabel={`expense-title-${item.id}`}
        >
          {item.title}
        </Text>
        <View
          style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}
          testID={`expense-status-${item.id}`}
          accessibilityLabel={`expense-status-${item.id}`}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text
        style={styles.expenseAmount}
        testID={`expense-amount-${item.id}`}
        accessibilityLabel={`expense-amount-${item.id}`}
      >
        ¥{item.amount.toLocaleString()}
      </Text>
      <Text style={styles.expenseDate}>
        {new Date(item.createdAt).toLocaleString('ja-JP')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>経費申請</Text>
        <TouchableOpacity
          onPress={handleLogout}
          testID="logout-button"
          accessibilityLabel="logout-button"
        >
          <Text style={styles.logoutText}>ログアウト</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>新規申請</Text>
        <TextInput
          style={styles.input}
          placeholder="タイトル (例: Conference)"
          value={title}
          onChangeText={setTitle}
          testID="title-input"
          accessibilityLabel="title-input"
        />
        <TextInput
          style={styles.input}
          placeholder="金額"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          testID="amount-input"
          accessibilityLabel="amount-input"
        />
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          testID="submit-button"
          accessibilityLabel="submit-button"
        >
          <Text style={styles.submitButtonText}>
            {loading ? '申請中...' : '申請する'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>申請履歴 ({expenses.length}件)</Text>
        <FlatList
          data={expenses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              testID="refresh-control"
            />
          }
          ListEmptyComponent={
            <Text
              style={styles.emptyText}
              testID="empty-message"
              accessibilityLabel="empty-message"
            >
              申請データがありません
            </Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutText: {
    color: '#007AFF',
    fontSize: 16,
  },
  formContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  expenseItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 12,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 32,
    fontSize: 16,
  },
});
