import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Main Screens
import Home from './src/screens/MainScreens/Home';
import Login from './src/screens/MainScreens/Login';
import SignUp from './src/screens/MainScreens/SignUp';
import ContactUs from './src/screens/MainScreens/ContactUs';
import AboutUs from './src/screens/MainScreens/AboutUs';

// Service Provider Screens
import ProviderProfile from './src/screens/ServiceProviderScreens/ProviderProfile';
import OrderManagement from './src/screens/ServiceProviderScreens/OrderManagement';
import Notifications from './src/screens/ServiceProviderScreens/Notifications';

// Service Seeker Screens
import SeekerProfile from './src/screens/ServiceSeekerScreens/SeekerProfile';
import ServiceProviders from './src/screens/ServiceSeekerScreens/ServiceProviders';
import Orders from './src/screens/ServiceSeekerScreens/Orders';
import Notification from './src/screens/ServiceSeekerScreens/Notification';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Main Drawer Navigator
function MainDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="About Us" component={AboutUs} />
      <Drawer.Screen name="Contact Us" component={ContactUs} />
      <Drawer.Screen name="Login" component={Login} />
      <Drawer.Screen name="Sign Up" component={SignUp} />
    </Drawer.Navigator>
  );
}

// Service Provider Drawer
function ServiceProviderDrawer() {
  return (
    <Drawer.Navigator initialRouteName="ProviderMenu">
      <Drawer.Screen name="ProviderProfile" component={ProviderProfile} />
      <Drawer.Screen name="OrderManagement" component={OrderManagement} />
      <Drawer.Screen name="Notifications" component={Notifications} />
      <Drawer.Screen name="About Us" component={AboutUs} />
      <Drawer.Screen name="Contact Us" component={ContactUs} />
    </Drawer.Navigator>
  );
}

// Service Seeker Drawer
function ServiceSeekerDrawer() {
  return (
    <Drawer.Navigator initialRouteName="SeekerMenu">
      <Drawer.Screen name="SeekerProfile" component={SeekerProfile} />
      <Drawer.Screen name="ServiceProviders" component={ServiceProviders} />
      <Drawer.Screen name="Orders" component={Orders} />
      <Drawer.Screen name="Notification" component={Notification} />
      <Drawer.Screen name="About Us" component={AboutUs} />
      <Drawer.Screen name="Contact Us" component={ContactUs} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainDrawer">
        <Stack.Screen
          name="MainDrawer"
          component={MainDrawer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerTitle: 'Login' }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerTitle: 'Sign Up' }}
        />
        <Stack.Screen
          name="SeekerDrawer"
          component={ServiceSeekerDrawer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProviderDrawer"
          component={ServiceProviderDrawer}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
