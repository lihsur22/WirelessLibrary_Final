import firebase from 'firebase';
import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Alert, KeyboardAvoidingView } from 'react-native';

export default class LoginScreen extends React.Component{
    constructor(){
        super();
        this.state = {emailId : '', passw : ''}
    }

    login = async (email, passw) => {
        if(email && passw){
            try{const response = await firebase.auth().signInWithEmailAndPassword(email, passw)
                if(response){
                    this.props.navigation.navigate('Tabs');
                }
            } catch(error){
                switch(error.code){
                    case 'auth/user-not-found' : alert('User Doesn\'t Exist')
                    break
                    case 'auth/invalid-email' : alert('Incorrect Email Address or Password')
                    break
                }
            }
        } else {
            alert('Enter Email And Password')
        }
    }

    render(){
        return(
            <KeyboardAvoidingView style={styles.container}>
                <View>
                    <Image source={require('../assets/booklogo.jpg')} style={{width:200, height:200}}/>
                    <Text style={styles.title}>Wi-Li</Text>
                </View>
                <View style={styles.s}>
                <TextInput placeholder='abc@emailadress.com' style={styles.textInput} value={this.state.emailId} keyboardType='email-address' onChangeText={(text) => {this.setState({ emailId: text })}}/>
                </View>
                <View style={styles.s}>
                    <TextInput placeholder='Password' style={styles.textInput} value={this.state.passw} secureTextEntry={true} onChangeText={(text) => {this.setState({ passw: text })}}/>
                </View>
                <View>
                    <TouchableOpacity onPress={()=>{this.login(this.state.emailId, this.state.passw)}} style={styles.loginButton}>
                        <Text>Log In </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
    },
    s : {
        flexDirection : 'row',
        margin : 20
    },
    loginButton : {
        backgroundColor : '#BBBBFF',
        padding : 10,
        borderWidth : 2
    },
    title:{
        textAlign: 'center',
        fontSize: 30,
        fontWeight : 'bold'
    },
    textInput : {
        borderWidth : 2,
        padding : 3
    }
})