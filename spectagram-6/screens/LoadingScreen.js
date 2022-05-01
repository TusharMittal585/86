import React,{Component} from 'react'
import {Text, View} from 'react-native' 
import firebase from 'firebase'



export default class LoadingSCreen extends React.Component{

componentDidMount(){
  this.checkIfLoggedIn()
}
checkIfLoggedIn=()=>{
  firebase.auth().onAuthStateChanged((user)=>{
    if(user){
      this.props.navigation.navigate("DashboardScreen")
    }else{
      this.props.navigation.navigate("LoginScreen")
    }
  })
  }


  render(){
    return(
      <View style={{
        flex:1,
        justifyContent:'center',
        alignItems:'center' }}
        >
      <Text>Loading</Text>
        </View>
     
    )
  }
}