// Navigation Setup
import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import AddCustomerScreen from './screens/AddCustomerScreen';
import CustomerPaymentDetailsScreen from './screens/CustomerPaymentDetailsScreen';
import EditCustomerScreen from './screens/EditCustomerScreen';
import CollectedPaymentsScreen from './screens/CollectedPaymentsScreen';
import {ActivityIndicator, View} from 'react-native';

const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        setInitialRoute(token ? 'DashboardScreen' : 'Login');
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
    checkLoginStatus();
  }, []);

  if (initialRoute === null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
        <Stack.Screen
          name="CustomerPaymentDetailsScreen"
          component={CustomerPaymentDetailsScreen}
        />
        <Stack.Screen
          name="EditCustomerScreen"
          component={EditCustomerScreen}
        />
        <Stack.Screen
          name="CollectedPaymentsScreen"
          component={CollectedPaymentsScreen}
        />
        <Stack.Screen name="AddCustomerScreen" component={AddCustomerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
