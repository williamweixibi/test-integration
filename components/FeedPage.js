import React, { Component } from 'react';

import { StyleSheet, View, Text, Platform, FlatList, TouchableOpacity, ActivityIndicator, ImageBackground} from 'react-native';

import {images} from '../components/image_def';

export default class FeedPage extends Component{

  //declare constructor variables that are used throughout the file
  constructor()
  {
    super();
    this.state =
    {
        isLoading: true,
        JSON_from_server: [],
        fetching_Status: false,
        isSelected: []
    }
    this.skip=0;
  }
  
  //fetching data as first thing
  componentDidMount()
  {
      fetch('https://us-central1-bonsai-interview-endpoints.cloudfunctions.net/movieTickets?limit=10')
      .then((response) => response.json())
      .then((responseJson) =>
      {
          this.setState({ JSON_from_server: [ ...this.state.JSON_from_server, ...responseJson ], isLoading: false });
      })
      .catch((error) =>
      {
          console.error(error);
      });
  }
  //fetch additional data from api
  fetch_more_data_from_server =()=>
  {        
    this.skip=this.skip+10;
    this.setState({ fetching_Status: true }, () =>
    {
      fetch('https://us-central1-bonsai-interview-endpoints.cloudfunctions.net/movieTickets?skip='+this.skip+'&limit=10')
      .then((response) => response.json())
      .then((responseJson) =>
      {
          this.setState({ JSON_from_server: [ ...this.state.JSON_from_server, ...responseJson ], fetching_Status: false });
      })
      .catch((error) =>
      {
          console.error(error);
      });
    });
  }

  //expansion details and state design
  //for all the item clicked, save it to a list and expands them when clicked, when, unselected, reverse the process and unselect them
  onPress = (oid) => () => {
    const newIsSelected = this.state.isSelected.includes(oid) ? this.state.isSelected.filter(foid => foid !== oid) : [...this.state.isSelected, oid];
    this.setState({ isSelected: newIsSelected });
  };

  //separating items in a list
  FlatListItemSeparator =()=> {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#607D8B",
        }}
      />
    );
  }

  //footer function for loading more data
  Render_Footer=()=> {
    return (
      <View style = { styles.footerStyle }>
          <TouchableOpacity 
              activeOpacity = { 0.7 } 
              style = { styles.TouchableOpacity_style }
              onPress = { this.fetch_more_data_from_server }>
              <Text style = { styles.TouchableOpacity_Inside_Text }>Load More Data From API</Text>
              {(this.state.fetching_Status )?<ActivityIndicator color = "#fff" style = {{ marginLeft: 6 }}/>:null}
          </TouchableOpacity> 
      </View>
    )
  }

  renderItem = ({ item, index }) => {
    const {isSelected} = this.state;
    const { title, genre, date, _id: { $oid } = {} } = item
    if (!title || !$oid) return null
    return <TouchableOpacity onPress={this.onPress($oid)}>
      <ImageBackground source={images.expand} style={styles.image}/> 
      <Text style = { styles.flatList_items }>
      {index} {"."} {"Title: "} {item.title!=null?item.title:item.title="Empty Data"}
      </Text>
      {isSelected.includes($oid) && <View><Text style={styles.description}>
      {"Genre: "}{item.genre!=null?item.genre.split("|").join(", "):null}{"\n"}
      {"Price: $"}{item.price!=null?item.price.toString().substring(0,5):null}{"\n"}
      {"Inventory: "}{item.inventory}{"\n"}
      {"Date: "}{item.date!=null?item.date.substring(0,10):null}{"\n"}
      {"Time: "}{item.date!=null?item.date.substring(11,19):null}{"\n"}
      {"Abbreviated Key : "}{item._id.$oid!=null?item._id.$oid.substring(21,24):null}</Text>
      <ImageBackground style={styles.imageViewContainer} source={item.image!=null?{uri : item.image}:null}/>
    </View>}
    </TouchableOpacity>
  }

  render()
  {
    return(
      <View style = { styles.MainContainer }>
      {
        ( this.state.isLoading )?( <ActivityIndicator size = "large" /> ):
          (
              <FlatList
                style={{width: '100%'}}
                keyExtractor = {(item)=>item._id.$oid}
                data = { this.state.JSON_from_server }
                ItemSeparatorComponent = {this.FlatListItemSeparator}
                renderItem = {this.renderItem}
                ListFooterComponent = { this.Render_Footer }
              />
          )
      }    
      </View>
    );
  }
}

//styles for cotainers used

const styles = StyleSheet.create(
{
  description:{
    marginLeft:10
  },
  container: {
    flex:1,
    flexDirection: 'column',
    margin:10
  },
  image: {
    width: 20,
    height:20,
    alignSelf:'flex-end'
  },
  imageViewContainer: {
    width: '50%',
    height: 100 ,
    margin: 10,
    borderRadius : 10
  },
  MainContainer:{
    flex: 1,
    justifyContent: 'center',
    margin: 5,
    paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0
  },
  red:{
    color:'#ff0000'
  },
  footerStyle:{
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderTopColor: '#009688'
  },
  TouchableOpacity_style:{
    padding: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F44336',
    borderRadius: 5,
  },
  TouchableOpacity_Inside_Text:{
    textAlign: 'center',
    color: '#fff',
    fontSize: 18
  },

  flatList_items:
  {
    fontSize: 20,
    color: '#000',
    padding: 10
  }
});