import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import api from '../src/services/api';

type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Dashboard: { user: any; token: string };
  Deposit: undefined;
  Withdraw: undefined;
};

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;
type DashboardScreenRouteProp = RouteProp<RootStackParamList, 'Dashboard'>;

interface Props {
  navigation: DashboardScreenNavigationProp;
  route: DashboardScreenRouteProp;
}

const DashboardScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user, token } = route.params;
  const [balance, setBalance] = useState(user.balance);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchBalance();
    fetchHistory();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await api.get('/savings/balance');
      setBalance(response.data.balance);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await api.get('/savings/history');
      setHistory(response.data.history);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Welcome, {user.email}</Text>
      <Text>Balance: ${balance}</Text>
      <Button title="Deposit" onPress={() => navigation.navigate('Deposit')} />
      <Button title="Withdraw" onPress={() => navigation.navigate('Withdraw')} />
      <Text>Transaction History:</Text>
      <FlatList
        data={history}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <Text>{item.type}: ${item.amount} - {new Date(item.createdAt).toLocaleString()}</Text>
        )}
      />
    </View>
  );
};

export default DashboardScreen;
