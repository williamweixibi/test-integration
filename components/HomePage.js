import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {createStackNavigator,createAppContainer} from 'react-navigation';
import FeedPage from '../components/FeedPage';

export class HomePage extends Component {
    render(){
        return(
            <View style={styles.container}>
            <TouchableOpacity onPress = {()=>this.props.navigation.navigate('Feed')}>
                <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require('../images/Github.png')}/>
                <Text style={styles.welcome}>Press to Load Feed</Text>
                </View>
            </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#CBFAF2',
    },
    new_container: {
      flex:1,
      backgroundColor: '#111111'
  
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    logoContainer: {
      alignItems: 'center',
      flexGrow:1,
      justifyContent:'center'
    },
    logo:{
      width: 200,
      height: 200
    }
  
});

const AppStackNavigator = createStackNavigator({
  Home: HomePage,
  Feed : FeedPage
});

const AppContainer = createAppContainer(AppStackNavigator);

export default class App extends Component{
    render(){
      return(
          <AppContainer />
      );
    }
}

