import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

import { RootTabParamList } from './types';
import RadarScreen from '../screens/RadarScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DiaryScreen from '../screens/DiaryScreen';
import MessagesScreen from '../screens/MessagesScreen';
import { useAuth } from '../state/AuthContext';
import { useChat } from '../state/ChatContext';

const Tab = createBottomTabNavigator<RootTabParamList>();

const DarkAppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0F172A',
    card: '#1E293B',
    text: '#F8FAFC',
    border: '#334155',
    primary: '#38BDF8',
  },
};

const TabIcon = ({ name, focused, badgeCount }: { name: string; focused: boolean; badgeCount?: number }) => {
  let iconSymbol = '🌐';
  if (name === 'Radar') iconSymbol = '📡';
  if (name === 'Diary') iconSymbol = '📅';
  if (name === 'Messages') iconSymbol = '💬';
  if (name === 'Profile') iconSymbol = '👤';

  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.iconText, focused && styles.iconTextActive]}>{iconSymbol}</Text>
      {badgeCount && badgeCount > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeCount}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default function AppNavigator() {
  const { user } = useAuth();
  const { conversations } = useChat();

  const totalUnreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <NavigationContainer theme={DarkAppTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#38BDF8',
          tabBarInactiveTintColor: '#94A3B8',
          tabBarStyle: {
            backgroundColor: '#1E293B',
            borderTopColor: '#334155',
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '700',
          },
        }}
      >
        <Tab.Screen
          name="Radar"
          component={RadarScreen}
          options={{
            tabBarLabel: 'Radar',
            tabBarIcon: ({ focused }) => <TabIcon name="Radar" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Diary"
          component={DiaryScreen}
          options={{
            tabBarLabel: 'Diary',
            tabBarIcon: ({ focused }) => (
              <TabIcon name="Diary" focused={focused} badgeCount={user?.isAvailable ? undefined : 1} />
            ),
          }}
        />
        <Tab.Screen
          name="Messages"
          component={MessagesScreen}
          options={{
            tabBarLabel: 'Messages',
            tabBarIcon: ({ focused }) => (
              <TabIcon name="Messages" focused={focused} badgeCount={totalUnreadMessages} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  iconText: {
    fontSize: 20,
    opacity: 0.65,
  },
  iconTextActive: {
    opacity: 1.0,
    transform: [{ scale: 1.15 }],
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
