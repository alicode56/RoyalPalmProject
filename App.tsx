import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import Invoices from './src/Invoices';
import BankCash from './src/BankCash';
import VendorList from './src/screens/VendorList';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name ='Dashboard' component={DashboardScreen}/>
          <Stack.Screen name ='VendorList' component={VendorList}/>
          <Stack.Screen name ='Invoices' component={Invoices}/>
          <Stack.Screen name ='BankCash' component={BankCash}/>

          
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};
export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});

