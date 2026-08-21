import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

import RadarScreen from './src/screens/RadarScreen';
import DiaryScreen from './src/screens/DiaryScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { AuthProvider } from './src/state/AuthContext';
import { ChatProvider } from './src/state/ChatContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <NavigationContainer>
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
                tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📡</Text>,
              }}
            />
            <Tab.Screen
              name="Diary"
              component={DiaryScreen}
              options={{
                tabBarLabel: 'Diary',
                tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📅</Text>,
              }}
            />
            <Tab.Screen
              name="Messages"
              component={MessagesScreen}
              options={{
                tabBarLabel: 'Messages',
                tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>💬</Text>,
              }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                tabBarLabel: 'Profile',
                tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>👤</Text>,
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </ChatProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 14,
    color: '#38BDF8',
    marginTop: 5,
  },
});
