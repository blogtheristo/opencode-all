import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './src/store';
import { nordicTheme } from './src/theme/nordicTheme';
import DrawerNavigator from './src/navigation/DrawerNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <PaperProvider theme={nordicTheme}>
          <NavigationContainer>
            <StatusBar style="dark" />
            <DrawerNavigator />
          </NavigationContainer>
        </PaperProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}
