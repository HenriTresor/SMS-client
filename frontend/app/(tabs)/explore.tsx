import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/services/apiClient';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Transaction } from '@/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components';

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuth();
  const colorScheme = useColorScheme();

  const loadTransactions = async () => {
    try {
      const response = await apiClient.getTransactionHistory();
      setTransactions(response.history);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to load transactions'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Loading your transactions...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            Transaction History
          </Text>
          <Text style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].text + '80' }]}>
            All your deposits and withdrawals
          </Text>
        </View>

        {transactions.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={[styles.emptyTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              No transactions yet
            </Text>
            <Text style={[styles.emptyText, { color: Colors[colorScheme ?? 'light'].text + '60' }]}>
              Your transaction history will appear here once you make your first deposit or withdrawal.
            </Text>
          </Card>
        ) : (
          <View style={styles.transactionsList}>
            {transactions.map((transaction) => (
              <Card key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionHeader}>
                  <View style={styles.transactionLeft}>
                    <View style={[
                      styles.transactionIcon,
                      {
                        backgroundColor: transaction.type === 'deposit' ? '#28a745' : '#dc3545',
                      }
                    ]}>
                      <Text style={styles.transactionIconText}>
                        {transaction.type === 'deposit' ? '↓' : '↑'}
                      </Text>
                    </View>
                    <View>
                      <Text style={[styles.transactionType, { color: Colors[colorScheme ?? 'light'].text }]}>
                        {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                      </Text>
                      <Text style={[styles.transactionDate, { color: Colors[colorScheme ?? 'light'].text + '60' }]}>
                        {formatDate(transaction.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <Text style={[
                    styles.transactionAmount,
                    {
                      color: transaction.type === 'deposit' ? '#28a745' : '#dc3545',
                    }
                  ]}>
                    {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </Text>
                </View>
                <View style={styles.transactionFooter}>
                  <Text style={[styles.transactionTime, { color: Colors[colorScheme ?? 'light'].text + '60' }]}>
                    {formatTime(transaction.createdAt)}
                  </Text>
                  <Text style={[styles.transactionId, { color: Colors[colorScheme ?? 'light'].text + '40' }]}>
                    ID: {transaction.id.slice(-8)}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  emptyCard: {
    margin: 20,
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  transactionsList: {
    padding: 20,
  },
  transactionCard: {
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIconText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 14,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  transactionTime: {
    fontSize: 12,
  },
  transactionId: {
    fontSize: 10,
    fontFamily: 'monospace',
  },
});
