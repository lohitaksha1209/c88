import React, { Component} from 'react';
import {StyleSheet, View, Text,TouchableOpacity} from 'react-native';
import { DrawerItems} from 'react-navigation-drawer';
import {Avatar} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import firebase from 'firebase';
import db from '../config';
export default class CustomSideBarMenu extends Component{
  constructor(){
    super();
    this.state={
      userId:firebase.auth().currentUser.email,
      image:null,
      name:"",
      docId:""
    }
  }
  //select the profile picture
  selectPicture=async()=>{
    const {cancelled,uri}=await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.All,
      allowsEditing:true,
      aspect:[4,3],
      quality:1
    })
    if(!cancelled)this.updateProfilePicture(uri)
  }
  //set the profile picture
  updateProfilePicture=(uri)=>{
    db.collection('users').doc(this.state.docId).update({
      image:uri
    })
  }
  //get the user profile
  getUserProfile()
  {
    db.collection('users').where('email_id','==',this.state.userId)
    onSnapshot(querySnapshot=>{
      querySnapshot.forEach(doc=>{
        this.setState({
          name:doc.data().first_name+" "+doc.data().last_name,
          docId:doc.id,
          image:doc.data().image
        })
      })
    })
  }
  //get user profile function when app renders
  componentDidMount(){
    this.getUserProfile()
  }
  render(){
    return(
      <View style={{flex:1}}>
        <View style={{flex:0.5,borderColor:'#abcdef',alignItems:"center",backgroundColor:'#123456'}}>
          <Avatar 
          rounded
          icon={{name:'user',type:'font-awesome'}}
          source={{uri:this.state.image}}size="medium"
          overlayContainerStyle={{backgroundColor:'white'}}
          onPress={()=>this.selectPicture()}
          activeOpacity={0.7}
          containerStyle={{flex:0.75,width:'40%',height:'20%',marginLeft:20,marginTop:20,borderRadius:40}}/>
          <Text style = {{fontWeight:'100',fontSize:20,paddingTop:10,}}> {this.state.name}</Text>
        </View>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props}/>
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity style={styles.logOutButton}
          onPress = {() => {
              this.props.navigation.navigate('WelcomeScreen')
              firebase.auth().signOut()
          }}>
            <Text>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container : {
    flex:1
  },
  drawerItemsContainer:{
    flex:0.8
  },
  logOutContainer : {
    flex:0.2,
    justifyContent:'flex-end',
    paddingBottom:30
  },
  logOutButton : {
    height:30,
    width:'100%',
    justifyContent:'center',
    padding:10
  },
  logOutText:{
    fontSize: 30,
    fontWeight:'bold'
  }
})
