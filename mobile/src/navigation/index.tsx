import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { Home, User, ShieldCheck, PlusCircle } from 'lucide-react-native';

// Screens (to be created)
import HomeScreen from '../screens/home/HomeScreen';
import PlotDetailScreen from '../screens/home/PlotDetailScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import RegisterPlotScreen from '../screens/profile/RegisterPlotScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import MyPlotsScreen from '../screens/profile/MyPlotsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { user } = useAuth();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#C2410C', // primary color
        tabBarInactiveTintColor: '#78716c',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Explore" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="List Plot" 
        component={RegisterPlotScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />,
        }}
      />
      {user?.role === 'administrator' && (
        <Tab.Screen 
          name="Admin" 
          component={AdminDashboardScreen} 
          options={{
            tabBarIcon: ({ color, size }) => <ShieldCheck color={color} size={size} />,
          }}
        />
      )}
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigation() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // Or a splash screen

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="PlotDetail" component={PlotDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MyPlots" component={MyPlotsScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
