import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/services/apiClient';
import { Button, Input, Card } from '@/components';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { NotificationService } from '@/services/notificationService';

export default function DepositScreen() {
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{ amount?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { setBalance } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const validateForm = () => {
    const newErrors: { amount?: string } = {};

    const numAmount = parseFloat(amount);
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    } else if (numAmount > 10000) {
      newErrors.amount = 'Maximum deposit amount is $10,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeposit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const numAmount = parseFloat(amount);

      const response = await apiClient.deposit({ amount: numAmount });

      // Show deposit notification
      await NotificationService.showDepositNotification(numAmount);

      // Update shared balance context using API response
      setBalance(response.balance);

      Alert.alert(
        'Deposit Successful',
        `Your deposit of $${numAmount.toFixed(2)} has been processed successfully. Your new balance is $${response.balance.toFixed(2)}.`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Deposit Failed',
        error instanceof Error ? error.message : 'An error occurred during deposit'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  const handlePresetAmount = (presetAmount: number) => {
    setAmount(presetAmount.toString());
    if (errors.amount) setErrors({});
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            Make a Deposit
          </Text>
          <Text style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].text + '80' }]}>
            Add money to your savings account
          </Text>
        </View>

        <Card style={styles.formCard}>
          <Input
            label="Deposit Amount"
            value={amount}
            onChangeText={(text) => {
              setAmount(text);
              if (errors.amount) setErrors({ ...errors, amount: undefined });
            }}
            placeholder="Enter amount (e.g., 100.00)"
            keyboardType="decimal-pad"
            leftIcon="dollarsign.circle.fill"
            error={errors.amount}
          />

          <Text style={[styles.presetLabel, { color: Colors[colorScheme ?? 'light'].text + '80' }]}>
            Quick amounts:
          </Text>
          <View style={styles.presetButtons}>
            {presetAmounts.map((presetAmount) => (
              <Button
                key={presetAmount}
                title={`$${presetAmount}`}
                onPress={() => handlePresetAmount(presetAmount)}
                variant="secondary"
                size="small"
                style={styles.presetButton}
              />
            ))}
          </View>

          <Button
            title="Deposit Money"
            onPress={handleDeposit}
            loading={isLoading}
            fullWidth
            style={styles.depositButton}
          />
        </Card>

        <Card style={styles.infoCard}>
          <Text style={[styles.infoTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            💡 Deposit Information
          </Text>
          <Text style={[styles.infoText, { color: Colors[colorScheme ?? 'light'].text + '80' }]}>
            • Deposits are processed instantly{'\n'}
            • Minimum deposit: $0.01{'\n'}
            • Maximum deposit: $10,000{'\n'}
            • You'll receive a confirmation notification
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
  formCard: {
    marginBottom: 20,
  },
  presetLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  presetButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  presetButton: {
    minWidth: 70,
  },
  depositButton: {
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
