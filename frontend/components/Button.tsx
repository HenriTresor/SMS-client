import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  DimensionValue,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const colorScheme = useColorScheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    switch (size) {
      case 'small':
        baseStyle.paddingVertical = 8;
        baseStyle.paddingHorizontal = 16;
        break;
      case 'large':
        baseStyle.paddingVertical = 16;
        baseStyle.paddingHorizontal = 24;
        break;
      default: // medium
        baseStyle.paddingVertical = 12;
        baseStyle.paddingHorizontal = 20;
    }

    if (disabled || loading) {
      return {
        ...baseStyle,
        ...style,
        backgroundColor: Colors[colorScheme ?? 'light'].text + '20',
      };
    }

    switch (variant) {
      case 'secondary':
        return {
          ...baseStyle,
          ...style,
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderWidth: 1,
          borderColor: Colors[colorScheme ?? 'light'].tint,
        };
      case 'danger':
        return {
          ...baseStyle,
          ...style,
          backgroundColor: '#dc3545',
        };
      case 'success':
        return {
          ...baseStyle,
          ...style,
          backgroundColor: '#28a745',
        };
      default: // primary
        return {
          ...baseStyle,
          ...style,
          backgroundColor: Colors[colorScheme ?? 'light'].tint,
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    switch (size) {
      case 'small':
        baseStyle.fontSize = 14;
        break;
      case 'large':
        baseStyle.fontSize = 18;
        break;
      default: // medium
        baseStyle.fontSize = 16;
    }

    if (disabled || loading) {
      return {
        ...baseStyle,
        ...textStyle,
        color: Colors[colorScheme ?? 'light'].text + '60',
      };
    }

    switch (variant) {
      case 'secondary':
        return {
          ...baseStyle,
          ...textStyle,
          color: Colors[colorScheme ?? 'light'].tint,
        };
      case 'danger':
        return {
          ...baseStyle,
          ...textStyle,
          color: '#ffffff',
        };
      default: // primary
        return {
          ...baseStyle,
          ...textStyle,
          color: '#000',
        };
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={getTextStyle().color}
          style={styles.loader}
        />
      )}
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loader: {
    marginRight: 8,
  },
});