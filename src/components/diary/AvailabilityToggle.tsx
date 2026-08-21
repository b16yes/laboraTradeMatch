import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';

interface AvailabilityToggleProps {
  isAvailable: boolean;
  onToggle: () => void;
}

export const AvailabilityToggle: React.FC<AvailabilityToggleProps> = ({ isAvailable, onToggle }) => {
  return (
    <View style={[styles.container, isAvailable ? styles.containerActive : styles.containerInactive]}>
      <View style={styles.leftInfo}>
        <View style={styles.statusHeader}>
          <View style={[styles.indicatorDot, isAvailable ? styles.dotGreen : styles.dotGray]} />
          <Text style={styles.statusTitle}>
            {isAvailable ? 'AVAILABLE ON RADAR' : 'CURRENTLY BUSY / OFF RADAR'}
          </Text>
        </View>
        <Text style={styles.statusDesc}>
          {isAvailable
            ? 'Your profile is live on nearby job radars & open for subcontractor calls.'
            : 'Turn on to let nearby tradesmen and contractor leads send direct jobs.'}
        </Text>
      </View>

      <Switch
        value={isAvailable}
        onValueChange={onToggle}
        trackColor={{ false: '#334155', true: '#0284C7' }}
        thumbColor={isAvailable ? '#38BDF8' : '#94A3B8'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    marginVertical: 8,
  },
  containerActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    borderColor: '#22C55E',
  },
  containerInactive: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  leftInfo: {
    flex: 1,
    paddingRight: 12,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  indicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  dotGreen: {
    backgroundColor: '#22C55E',
  },
  dotGray: {
    backgroundColor: '#64748B',
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  statusDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
  },
});
