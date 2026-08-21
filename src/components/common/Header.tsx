import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightActionText?: string;
  onRightAction?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, rightActionText, onRightAction }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightActionText && onRightAction ? (
        <TouchableOpacity style={styles.actionBtn} onPress={onRightAction} activeOpacity={0.7}>
          <Text style={styles.actionText}>{rightActionText}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  actionBtn: {
    backgroundColor: '#1E293B',
    borderColor: '#38BDF8',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '600',
  },
});
