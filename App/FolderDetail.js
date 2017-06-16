import React, { Component } from 'react';
import { Container, Content, Card, CardItem, Body, Button, Icon, List, ListItem, Thumbnail, Left, Right } from 'native-base';
import {Image, Modal, Text, TouchableHighlight, View, Alert, StyleSheet, AlertIOS} from 'react-native';
import PhotoBrowser from 'react-native-photo-browser';
import {observer} from 'mobx-react/native'

const FolderGrid =  observer(class FolderGrid extends Component {

  state = {
    selectedFolder:{}
  }

  constructor(props){
    super(props);
  }

  _onSelectionChanged(media, index, selected){
    console.log(`${media.photo} selection status: ${selected} index:${index}`);
  }

  render() {
    let {screenshotList} = this.props;
    let mediaList = this.screenshotList.map(screenshot=>{return{photo:screenshot.photo,selected:screenshot.selected}});
    return (
      <Content>
        <PhotoBrowser
          mediaList={mediaList}
          displayActionButton={true}
          displayTopBar={false}
          renderTopBar={false}
          displaySelectionButtons={true}
          onSelectionChanged={this._onSelectionChanged}
          enableFullScreen={true}
          startOnGrid={false}
        />
      </Content>
    );
  }
});

const styles = StyleSheet.create({
  column:{
    flexDirection:'column'
  },
  row: {
    flexDirection:'row',
    justifyContent:'center'
  },
  image: {
    margin: 4,
    width:100,
    height:100
  }
});

export default FolderGrid;
