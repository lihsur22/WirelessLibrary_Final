import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class TSscreen extends React.Component{
    render(){
        return (
            <View style={styles.container}>
                <Text>Issue or return</Text>
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