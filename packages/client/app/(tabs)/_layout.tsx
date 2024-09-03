import { Tabs } from 'expo-router';
import React, { FC } from 'react';
import { TabBarIcon } from '@/components/TabBarIcon/TabBarIcon';
import { useAuthProtected } from '@/hooks/auth-protected';

const LayoutTabs: FC = () => {
  useAuthProtected();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0a7ea4',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'home' : 'home-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'code-slash' : 'code-slash-outline'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default LayoutTabs;
