import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import SearchResultsScreen from './src/screens/SearchResultsScreen';
import MovieDetailsScreen from './src/screens/MovieDetailsScreen';
import SubscribeScreen from './src/screens/SubscribeScreen';

export type RootStackParamList = {
  Home: undefined;
  Search: { query?: string } | undefined;
  Details: { id: number };
  Subscribe: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home">
          {(props) => (
            <HomeScreen
              onNavigate={(route, params) => props.navigation.navigate(route as any, params)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Search">
          {(props) => (
            <SearchResultsScreen
              initialQuery={(props.route.params as any)?.query || ''}
              onNavigate={(route, params) => props.navigation.navigate(route as any, params)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Details">
          {(props) => (
            <MovieDetailsScreen
              id={(props.route.params as any)?.id}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Subscribe">
          {(props) => (
            <SubscribeScreen onNavigate={(route) => props.navigation.navigate(route as any)} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
