import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiClient } from '@/services/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Transaction } from '@/types';
import { NotificationService } from '@/services/notificationService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card } from '@/components';

export default function DashboardScreen() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user, refreshBalance } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const loadDashboardData = async () => {
    try {
      const [balanceResponse, historyResponse] = await Promise.all([
        apiClient.getBalance(),
        apiClient.getTransactionHistory(),
      ]);

      setBalance(balanceResponse.balance);
      setTransactions(historyResponse.history);

      // Check for low balance and show notification
      if (balanceResponse.balance < 10) {
        await NotificationService.showLowBalanceNotification(balanceResponse.balance);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to load dashboard data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    await refreshBalance();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    refreshBalance()
  }, [refreshBalance])

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Loading your dashboard...
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
          <Text style={[styles.welcomeText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Welcome back, {user?.email}
          </Text>
          <Text style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].text + '80' }]}>
            Your savings account overview
          </Text>
        </View>

        {/* Balance Card */}
        <Card style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={[styles.balanceLabel, { color: Colors[colorScheme ?? 'light'].text + '80' }]}>
              Current Balance
            </Text>
            <Text style={[styles.balanceAmount, { color: Colors[colorScheme ?? 'light'].text }]}>
              {formatCurrency(balance)}
            </Text>
          </View>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionButtons}>
            <Button
              title="Deposit"
              onPress={() => router.push('/deposit')}
              variant="success"
              style={styles.actionButton}
            />
            <Button
              title="Withdraw"
              onPress={() => router.push('/withdraw')}
              variant="danger"
              style={styles.actionButton}
            />
          </View>
        </Card>

        {/* Transaction History */}
        <Card style={styles.historyCard}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Recent Transactions
          </Text>
          {transactions.length === 0 ? (
            <Text style={[styles.emptyText, { color: Colors[colorScheme ?? 'light'].text + '60' }]}>
              No transactions yet
            </Text>
          ) : (
            transactions.slice(0, 5).map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
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
            ))
          )}
        </Card>
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  balanceCard: {
    margin: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  balanceHeader: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  actionsCard: {
    margin: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  historyCard: {
    margin: 20,
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
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
    fontWeight: '500',
  },
  transactionDate: {
    fontSize: 14,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});
