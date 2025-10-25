import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../src/services/api';

type RootStackParamList = {
  Withdraw: undefined;
  Dashboard: { user: any; token: string };
};

type WithdrawScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Withdraw'>;

interface Props {
  navigation: WithdrawScreenNavigationProp;
}

const WithdrawScreen: React.FC<Props> = ({ navigation }) => {
  const [amount, setAmount] = useState('');

  const handleWithdraw = async () => {
    try {
      await api.post('/savings/withdraw', { amount: parseFloat(amount) });
      Alert.alert('Success', 'Withdrawal successful');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Withdrawal failed');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text>Amount to Withdraw:</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <Button title="Withdraw" onPress={handleWithdraw} />
    </View>
  );
};

export default WithdrawScreen;
