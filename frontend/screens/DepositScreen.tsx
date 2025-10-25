import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../src/services/api';
import { API_ENDPOINTS } from '../src/constants';
import Button from '../src/components/Button';
import Input from '../src/components/Input';
import Card from '../src/components/Card';

type RootStackParamList = {
  Deposit: undefined;
  Dashboard: { user: any; token: string };
};

type DepositScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Deposit'>;

interface Props {
  navigation: DepositScreenNavigationProp;
}

const DepositScreen: React.FC<Props> = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await api.post(API_ENDPOINTS.DEPOSIT, { amount: numAmount });
      Alert.alert('Success', 'Deposit successful');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Deposit Funds</Text>
        <Text style={styles.subtitle}>Add money to your account</Text>

        <Input
          label="Amount"
          placeholder="Enter amount to deposit"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <Button
          title={loading ? "Depositing..." : "Deposit"}
          onPress={handleDeposit}
          disabled={loading}
        />

        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          variant="outline"
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
});

export default DepositScreen;
