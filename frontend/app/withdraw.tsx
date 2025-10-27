import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/services/apiClient';
import { Button, Input, Card } from '@/components';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { NotificationService } from '@/services/notificationService';

export default function WithdrawScreen() {
  const [amount, setAmount] = useState('');
  const [currentBalance, setCurrentBalance] = useState(0);
  const [errors, setErrors] = useState<{ amount?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  const { user, refreshBalance } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const loadBalance = async () => {
    try {
      const response = await apiClient.getBalance();
      setCurrentBalance(response.balance);
    } catch (error) {
      console.error('Error loading balance:', error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  useEffect(() => {
    loadBalance();
  }, []);

  const validateForm = () => {
    const newErrors: { amount?: string } = {};

    const numAmount = parseFloat(amount);
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    } else if (numAmount > currentBalance) {
      newErrors.amount = `Insufficient balance. Available: $${currentBalance.toFixed(2)}`;
    } else if (numAmount > 1000) {
      newErrors.amount = 'Maximum withdrawal amount is $1,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWithdraw = async () => {
    if (!validateForm()) return;

    // Double-check balance before proceeding
    await loadBalance();

    const numAmount = parseFloat(amount);
    if (numAmount > currentBalance) {
      Alert.alert('Insufficient Balance', `Your current balance is $${currentBalance.toFixed(2)}.`);
      return;
    }

    try {
      setIsLoading(true);

      const response = await apiClient.withdraw({ amount: numAmount });

      // Show withdrawal notification
      await NotificationService.showWithdrawalNotification(numAmount);

      // Check for low balance after withdrawal
      if (response.balance < 10) {
        await NotificationService.showLowBalanceNotification(response.balance);
      }

      // Refresh balance in context
      await refreshBalance();

      Alert.alert(
        'Withdrawal Successful',
        `Your withdrawal of $${numAmount.toFixed(2)} has been processed successfully. Your new balance is $${response.balance.toFixed(2)}.`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Withdrawal Failed',
        error instanceof Error ? error.message : 'An error occurred during withdrawal'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxAmount = () => {
    const maxAmount = Math.min(currentBalance, 1000);
    setAmount(maxAmount.toString());
    if (errors.amount) setErrors({});
  };

  if (isLoadingBalance) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Loading your balance...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            Make a Withdrawal
          </Text>
          <Text style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].text + '80' }]}>
            Withdraw money from your savings account
          </Text>
        </View>

        {/* Current Balance Display */}
        <Card style={styles.balanceCard}>
          <Text style={[styles.balanceLabel, { color: Colors[colorScheme ?? 'light'].text + '80' }]}>
            Current Balance
          </Text>
          <Text style={[styles.balanceAmount, { color: Colors[colorScheme ?? 'light'].text }]}>
            ${currentBalance.toFixed(2)}
          </Text>
        </Card>

        <Card style={styles.formCard}>
          <Input
            label="Withdrawal Amount"
            value={amount}
            onChangeText={(text) => {
              setAmount(text);
              if (errors.amount) setErrors({ ...errors, amount: undefined });
            }}
            placeholder="Enter amount (e.g., 50.00)"
            keyboardType="decimal-pad"
            leftIcon="dollarsign.circle.fill"
            error={errors.amount}
          />

          <View style={styles.actionButtons}>
            <Button
              title="Max Available"
              onPress={handleMaxAmount}
              variant="secondary"
              size="small"
              style={styles.maxButton}
            />
          </View>

          <Button
            title="Withdraw Money"
            onPress={handleWithdraw}
            loading={isLoading}
            fullWidth
            style={styles.withdrawButton}
            disabled={currentBalance <= 0}
          />
        </Card>

        <Card style={styles.infoCard}>
          <Text style={[styles.infoTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            ⚠️ Withdrawal Information
          </Text>
          <Text style={[styles.infoText, { color: Colors[colorScheme ?? 'light'].text + '80' }]}>
            • Cannot withdraw more than your current balance{'\n'}
            • Minimum withdrawal: $0.01{'\n'}
            • Maximum withdrawal: $1,000{'\n'}
            • You'll receive a confirmation notification{'\n'}
            • Low balance warnings apply after withdrawal
          </Text>
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
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  balanceCard: {
    marginBottom: 20,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  formCard: {
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'flex-end',
  },
  maxButton: {
    minWidth: 120,
  },
  withdrawButton: {
    marginTop: 8,
  },
  infoCard: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
