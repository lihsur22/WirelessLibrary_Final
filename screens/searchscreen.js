import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import db from '../config'

export default class SearchScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {allTrans : [], lastVisTrans : null, search : ''}
    }

    searchTransaction = async (text) => {
        var enteredText = text.split("");
        this.setState({allTrans : []})
        if(enteredText[0].toUpperCase() === 'W'){
            const transaction = await db.collection("transactions").where('bookId','==',text).get();
            transaction.docs.map((doc)=>{this.setState({allTrans : [...this.state.allTrans,doc.data()], lastVisTrans : doc })})
        } else if(enteredText[0].toUpperCase() === 'S') {
            const transaction = await db.collection("transactions").where('studentId','==',text).get();
            transaction.docs.map((doc)=>{this.setState({allTrans : [...this.state.allTrans,doc.data()], lastVisTrans : doc })})
        }
    }

    fetchMoreTrans = async () => {
        var text = this.state.search.toUpperCase();
        var enteredText = text.split("");
        if(enteredText[0] === 'W'){
            const query = await db.collection("transactions").where('bookId','==',text).startAfter(this.state.lastVisTrans).limit(10).get();
            query.docs.map((doc)=>{this.setState({allTrans : [...this.state.allTrans,doc.data()], lastVisTrans : doc })})
        } else if(enteredText[0] === 'S') {
            const query = await db.collection("transactions").where('studentId','==',text).startAfter(this.state.lastVisTrans).limit(10).get();
            query.docs.map((doc)=>{this.setState({allTrans : [...this.state.allTrans,doc.data()], lastVisTrans : doc })})
        }
    }

    componentDidMount = async () => {
        const query = await db.collection("transactions").limit(10).get()
        query.docs.map((doc)=>{this.setState({allTrans : [], lastVisTrans : doc})})
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.searchBox}>
                    <View style={styles.searchPrecise}>
                    <TextInput placeholder="Search" style={styles.searchBar} onChangeText={(text)=>{this.setState({search : text.toUpperCase()})}}/>
                    <TouchableOpacity style={styles.searchButton} onPress={()=>{this.searchTransaction(this.state.search)}}>
                        <Text>Search</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                <FlatList 
                    data={this.state.allTrans}
                    renderItem={({item})=>
                        (
                            <View style={{borderBottomWidth : 2}}>
                                <Text>{'Book Id : ' + item.bookId}</Text>
                                <Text>{'Student Id : ' + item.studentId}</Text>
                                <Text>{'Transaction Type : ' + item.transactionType}</Text>
                                <Text>{'Date : ' + item.date.toDate()}</Text>
                            </View>
                        )
                    }
                    keyExtractor={(item,index)=>index.toString()}
                    onEndReachedThreshold={0.8}
                    onEndReached={this.fetchMoreTrans()}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        marginTop : 20
    },
    searchBox : {
        flexDirection : 'row',
        height : 50,
        width : 'auto',
        backgroundColor : '#BBBBFF',
        alignItems : 'center'
    },
    searchPrecise : {
        flexDirection : 'row',
        marginLeft : 50
    },
    searchBar : {
        borderWidth : 2,
        padding : 3,
        borderRightWidth : 0,
    },
    searchButton : {
        backgroundColor : '#BBBBFF',
        padding : 10,
        borderWidth : 2,
        borderLeftWidth : 1,
    }
})