import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import MainPage from './MainPage'; // Ensure this file exists
import Page from './Page'; // Ensure this file exists

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainPage">
        {/* Main Page */}
        <Stack.Screen
          name="MainPage"
          component={MainPage}
          options={{ title: 'หน้าหลัก' }}
        />
        {/* Page Component */}
        <Stack.Screen
          name="Page"
          component={Page}
          options={{ title: 'ข้อมูลมหาวิทยาลัย' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}