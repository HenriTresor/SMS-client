import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import api, { getDeviceId, setAuthToken } from '../src/services/api';

type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Dashboard: { user: any; token: string };
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const deviceId = await getDeviceId();
    try {
      const response = await api.post('/auth/login', { email, password, deviceId });
      const { token, user } = response.data;
      setAuthToken(token);
      navigation.navigate('Dashboard', { user, token });
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

export default LoginScreen;
