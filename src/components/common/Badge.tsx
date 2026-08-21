import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  isSmall?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', isSmall = false }) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ADE80', border: 'rgba(34, 197, 94, 0.3)' };
      case 'warning':
        return { bg: 'rgba(234, 179, 8, 0.15)', text: '#FACC15', border: 'rgba(234, 179, 8, 0.3)' };
      case 'danger':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)' };
      case 'neutral':
        return { bg: 'rgba(148, 163, 184, 0.15)', text: '#CBD5E1', border: 'rgba(148, 163, 184, 0.3)' };
      case 'primary':
      default:
        return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38BDF8', border: 'rgba(56, 189, 248, 0.3)' };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg, borderColor: colors.border },
        isSmall && styles.badgeSmall,
      ]}
    >
      <Text style={[styles.badgeText, { color: colors.text }, isSmall && styles.badgeTextSmall]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  badgeTextSmall: {
    fontSize: 10,
  },
});
