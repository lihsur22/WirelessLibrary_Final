import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import TSscreen from './screens/booktsscreen';
import SearchScreen from './screens/searchscreen';
import LoginScreen from './screens/loginscreen';

export default function App() {
  return (
    <AppContainer/>
  );
}

const tabNavigator = createBottomTabNavigator({
  A : {screen : TSscreen},
  B : {screen : SearchScreen},
},
  {defaultNavigationOptions : ({navigation}) => ({tabBarIcon : () => {
    const routeName = navigation.state.routeName
    if(routeName==="A")
    {
      return(<Image source={require("./assets/book.png")} style={{width:40, height:40}}/>)
    } else if (routeName === "B")
    {
      return(<Image source={require("./assets/searchingbook.png")} style={{width:40, height:40}}/>)
    }
  }})}
)

const switchNav = createSwitchNavigator({
  A : {screen : LoginScreen},
  Tabs : {screen : tabNavigator}
})

//const TabNavigator = createBottomTabNavigator({ Transaction: {screen: TransactionScreen}, Search: {screen: SearchScreen}, }, { defaultNavigationOptions: ({navigation})=>({ tabBarIcon: ()=>{ const routeName = navigation.state.routeName; console.log(routeName) if(routeName === "Transaction"){ return( <Image source={require("./assets/book.png")} style={{width:40, height:40}} /> ) } else if(routeName === "Search"){ return( <Image source={require("./assets/searchingbook.png")} style={{width:40, height:40}} />) } } }) } );


const AppContainer = createAppContainer(switchNav);