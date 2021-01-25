import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import TSscreen from './screens/booktsscreen';
import SearchScreen from './screens/searchscreen';

export default function App() {
  return (
    <AppContainer/>
  );
}

const styles = StyleSheet.create({
});

const tabNavigator = createBottomTabNavigator({
  A : {screen : TSscreen},
  B : {screen : SearchScreen}
})

const AppContainer = createAppContainer(tabNavigator);