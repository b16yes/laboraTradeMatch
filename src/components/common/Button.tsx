import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'secondary':
        return { bg: '#334155', text: '#F8FAFC', border: 'transparent' };
      case 'outline':
        return { bg: 'transparent', text: '#38BDF8', border: '#38BDF8' };
      case 'danger':
        return { bg: '#EF4444', text: '#FFFFFF', border: 'transparent' };
      case 'primary':
      default:
        return { bg: '#0284C7', text: '#FFFFFF', border: 'transparent' };
    }
  };

  const currentStyle = getStyles();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: currentStyle.bg, borderColor: currentStyle.border },
        currentStyle.border !== 'transparent' && { borderWidth: 1.5 },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={currentStyle.text} size="small" />
      ) : (
        <Text style={[styles.buttonText, { color: currentStyle.text }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 4,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
});
