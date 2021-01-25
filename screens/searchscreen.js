import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class SearchScreen extends React.Component{
    render(){
        return (
            <View style={styles.container}>
                <Text>Here you can search</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
    }
})