import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, KeyboardAvoidingView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import firebase from 'firebase';
import db from '../config'

export default class TSscreen extends React.Component{
    constructor(){
        super();
        this.state={hasCameraPermissions : null, scanned : false, scannedBookID : '', scannedStudentID : '', buttonState : 'normal', transMsg : ''}
    }

    getCameraPermission = async (id) => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({hasCameraPermissions:status==='granted',  buttonState: id,
        scanned: false})
        //if status granted = denied then it will return false

        
    }

    handleBarcodeScanned = async ({type, data}) => {
        const {buttonState} = this.state

        if(buttonState==="BookId"){
            this.setState({
            scanned: true,
            scannedBookID: data,
            buttonState: 'normal'
            });
        }
        else if(buttonState==="StudentId"){
            this.setState({
            scanned: true,
            scannedStudentID: data,
            buttonState: 'normal'
            });
        }
    }

    initBookIssue = async ()=>{
        //add a transaction
        db.collection("transactions").add({
          'studentId' : this.state.scannedStudentID,
          'bookId' : this.state.scannedBookID,
          'date' : firebase.firestore.Timestamp.now().toDate(),
          'transactionType' : "Issue"
        })
    
        //change book status
        db.collection("books").doc(this.state.scannedBookID).update({
          'bookAvailability' : false
        })
        //change number of issued books for student
        db.collection("students").doc(this.state.scannedStudentID).update({
          'numberOfBooksIssued' : firebase.firestore.FieldValue.increment(1)
        })
    
        this.setState({
          scannedStudentID : '',
          scannedBookID: ''
        })
    }
    
    initBookReturn = async ()=>{
        //add a transaction
        db.collection("transactions").add({
            'studentId' : this.state.scannedStudentID,
            'bookId' : this.state.scannedBookID,
            'date'   : firebase.firestore.Timestamp.now().toDate(),
            'transactionType' : "Return"
        })
    
        //change book status
        db.collection("books").doc(this.state.scannedBookID).update({
            'bookAvailability' : true
        })
    
        //change book status
        db.collection("students").doc(this.state.scannedStudentID).update({
            'numberOfBooksIssued' : firebase.firestore.FieldValue.increment(-1)
        })
    
        this.setState({
            scannedStudentID : '',
            scannedBookID : ''
        })
    }

    checkStudentEligibilityForIssue = async () => {
        const stRef = await db.collection("students/").where("studentID","==",this.state.scannedStudentID).get();
        //const stRef = await db.collection("students/ ST0010234/studentID").get();
        var isStudentEligible = '';
        if(stRef.docs.length == 0){
            this.setState({
                scannedStudentID : '',
                scannedBookID : ''
            });
            isStudentEligible = false;
            alert("Student Id is Non-Existent");
        } else {
            stRef.docs.map(doc=>{var student = doc.data()
                if(student.numberOfBooksIssued < 2){
                    isStudentEligible = true;
                } else {
                    isStudentEligible = false;
                    alert("The Student has already Issued 2 books");
                    this.setState({
                        scannedStudentID : '',
                        scannedBookID : ''
                    });
                }
            });
        }
        return isStudentEligible;
    }

    checkStudentEligibilityForReturn = async () => {
        const trRef = await db.collection("transactions/").where("bookId","==",this.state.scannedBookID).limit(1).get();
        var isStudentEligible = '';
        if(trRef.docs.length==0){
            isStudentEligible = false;
            alert("Something Went Wrong");
        } else {
            trRef.docs.map(doc=>{var lastBookTrans = doc.data()
                if(lastBookTrans.studentId === this.state.scannedStudentID){
                    isStudentEligible = true;
                } else {
                    isStudentEligible = false;
                    alert("The Book Hasn't Been Issued By The Student");
                    this.setState({
                        scannedStudentID : '',
                        scannedBookID : ''
                    });
                }   
            });
        }
        return isStudentEligible;
    }

    checkBookEligibility = async () => {
        const bookRef = await db.collection("books/").where("bookID","==",this.state.scannedBookID).get();
        //console.log(bookRef.docs);
        var transactionType = '';
        if(bookRef.docs.length==0){
            transactionType = false;
        } else {
            bookRef.docs.map(doc=>{var book = doc.data()
                //console.log(doc.data());
                if(book.bookAvailability){
                    transactionType = "Issue";
                } else {
                    transactionType = "Return";
                }
            });
        }
        return transactionType;
    }

    handleTransaction = async () => {
        var transactionType = await this.checkBookEligibility();
        if(!transactionType){
            alert("Book Doesn't Exist in Library");
            this.setState({
                scannedStudentID : '',
                scannedBookID : ''
            });
        } else if(transactionType === 'Issue') {
            var isStudentEligible = await this.checkStudentEligibilityForIssue();
            if(isStudentEligible){
                this.initBookIssue();
                alert('Book Has Been Issued');
            }
        } else {
            var isStudentEligible = await this.checkStudentEligibilityForReturn();
            if(isStudentEligible){
                this.initBookReturn();
                alert("Book Returned to Library");
            }
        }

        /*var transMsg = '';
        db.collection("books").doc(this.state.scannedBookID).get()
        .then((doc)=>{
            var book = doc.data();
            console.log(book);
            if(book.bookAvailability){
                this.initBookIssue();
                transMsg = 'Book Issued';
                alert(transMsg);
            } else 
            {
                this.initBookReturn();
                transMsg = 'Book Returned';
                alert(transMsg);
            }
        })
        this.setState({transMsg : transMsg});*/
    }

    render(){
        const hasCameraPermissions = this.state.hasCameraPermissions;
        const scanned = this.state.scanned;
        const buttonState = this.state.buttonState;
        
        if (buttonState !== "normal" && hasCameraPermissions){
            return (<BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarcodeScanned}
            style={StyleSheet.absoluteFillObject}/>)
        } 
        else if(buttonState==="normal") {
            return(
                <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
                    <View>
                        <Image source={require('../assets/booklogo.jpg')} style={{width:200, height:200}}/>
                        <Text style={styles.title}>Wi-Li</Text>
                    </View>
                    <View style={styles.s}>
                        <TextInput placeholder='Book ID' style={styles.textInput} value={this.state.scannedBookID} onChangeText={(text) => {this.setState({ scannedBookID: text })}}/>
                        <TouchableOpacity onPress={()=>{this.getCameraPermission("BookId")}} style={styles.scanButton}>
                            <Text>Scan</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.s}>
                        <TextInput placeholder='Student ID' style={styles.textInput} value={this.state.scannedStudentID} onChangeText={(text) => {this.setState({ scannedStudentID: text })}}/>
                        <TouchableOpacity onPress={()=>{this.getCameraPermission("StudentId")}} style={styles.scanButton}>
                            <Text>Scan</Text>
                        </TouchableOpacity>
                    </View>
                    <Text>{this.state.transMsg}</Text>
                    <TouchableOpacity onPress={async () => {var x = await this.handleTransaction()}}>
                        <Text>Submit</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            )
        }
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
    },
    title:{
        textAlign: 'center',
        fontSize: 30,
        fontWeight : 'bold'
    },
    s : {
        flexDirection : 'row',
        margin : 20
    },
    scanButton : {
        backgroundColor : '#BBBBFF',
        padding : 10,
        borderWidth : 2,
        borderLeftWidth : 1,
    },
    text : {
        fontSize : 18,
        textDecorationLine : 'underline',
    },
    textInput : {
        borderWidth : 2,
        padding : 3,
        borderRightWidth : 0,
    },
})