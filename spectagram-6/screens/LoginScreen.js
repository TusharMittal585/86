import React,{Component} from 'react'
import { View,Text, StyleSheet, SafeAreaView, Platform, StatusBar, Image, TouchableOpacity} from 'react-native' 
import * as Google from "expo-google-app-auth";
import firebase from 'firebase' 
import {RFValue} from 'react-native-responsive-fontsize' 
 
export default class LoginScreen extends React.Component{
  constructor(props){
    super(props);
  this.state={
    fontsLoaded:true
  }
  }
   isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
          firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
         
          return true;
        }
      }
    }
    return false;
  };
   onSignIn = googleUser => {
    
    var unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
      unsubscribe();
      
      if (!this.isUserEqual(googleUser, firebaseUser)) {
       
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );

       
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(function (result) {
            if (result.additionalUserInfo.isNewUser) {
              firebase
                .database()
                .ref("/users/" + result.user.uid)
                .set({
                  gmail: result.user.email,
                  profile_picture: result.additionalUserInfo.profile.picture,
                  locale: result.additionalUserInfo.profile.locale,
                  first_name: result.additionalUserInfo.profile.given_name,
                  last_name: result.additionalUserInfo.profile.family_name,
                  current_theme: "dark"
                })
                .then(function (snapshot) { });
            }
          })
          .catch(error => {
            
            var errorCode = error.code;
            var errorMessage = error.message;
           
            var email = error.email;
         
            var credential = error.credential;
        
          });
      } else {
        console.log("User already signed-in Firebase.");
      }
    });
  };
   signInWithGoogleAsync = async () => {
      const result = await Google.logInAsync({
        behaviour: "web",
        androidClientId:
          "891447745747-477pnmv25kb8jvl7h5k65h4jl9g99q60.apps.googleusercontent.com",
        iosClientId:
          "891447745747-05c2a5ggd4snhnee2uob1912eclepr6i.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      });
    
  }
  render(){
  if(!this.state.fontsLoaded){
return <Text>Loading...</Text>
  } else{
    return(
      <View style={styles.container}>
<SafeAreaView style={styles.droidSafeArea}/>
<View style={styles.appTitle}>
     
  <Image source={require("../assets/logo.png")} style={styles.appIcon}></Image>
  <Text style={styles.appTitleText}>Spectagram</Text>
  </View>
  
  <View style={styles.buttonContainer}>
<TouchableOpacity style={styles.button} onPress={()=>{this.signInWithGoogleAsync}}>
<Image source={require("../assets/google_icon.png")} style={styles.googleIcon}></Image>
<Text style={styles.googleText}>Sign in with google</Text>
</TouchableOpacity>
</View>
<View style={styles.cloudContainer}>
<Image source={require("../assets/cloud.png")} style={styles.cloudImage}></Image>
</View>
</View>


    )
  }
  }
}const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appTitle: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center"
  },
  appIcon: {
    width: RFValue(130),
    height: RFValue(130),
    resizeMode: "contain"
  },
  appTitleText: {
    color: "white",
    textAlign: "center",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans"
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    width: RFValue(250),
    height: RFValue(50),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: RFValue(30),
    backgroundColor: "white"
  },
  googleIcon: {
    width: RFValue(30),
    height: RFValue(30),
    resizeMode: "contain"
  },
  googleText: {
    color: "black",
    fontSize: RFValue(20),
    fontFamily: "Bubblegum-Sans"
  },
  cloudContainer: {
    flex: 0.3
  },
  cloudImage: {
    position: "absolute",
    width: "100%",
    resizeMode: "contain",
    bottom: RFValue(-5)
  }
});

