import { View, Text, StatusBar } from 'react-native'
import React, { useEffect } from 'react'
import AppNavigation from './src/navigation';
import SplashScreen from 'react-native-splash-screen';

function App() {

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  },[]);

  return (
    <><StatusBar backgroundColor="white" barStyle="dark-content" />
      <AppNavigation /></>
  );
};

export default App;