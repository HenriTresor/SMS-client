import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Redirect, usePathname, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

function AuthenticatedLayout() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const inAuthGroup = pathname.startsWith('/(auth)');

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const shouldRedirectToLogin = !user && !inAuthGroup;
  const shouldRedirectToTabs = user && inAuthGroup;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {shouldRedirectToLogin && <Redirect href="/(auth)/login" />}
      {shouldRedirectToTabs && <Redirect href="/(tabs)" />}
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthenticatedLayout />
    </AuthProvider>
  );
}
