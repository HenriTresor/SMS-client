import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../src/services/api';

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

  const handleDeposit = async () => {
    try {
      await api.post('/savings/deposit', { amount: parseFloat(amount) });
      Alert.alert('Success', 'Deposit successful');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Deposit failed');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text>Amount to Deposit:</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <Button title="Deposit" onPress={handleDeposit} />
    </View>
  );
};

export default DepositScreen;
