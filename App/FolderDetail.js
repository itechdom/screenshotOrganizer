import React from 'react';
import { Container, Content, Card, CardItem, Body, Button, Icon, List, ListItem, Thumbnail, Left, Right } from 'native-base';
import {Image, Modal, Text, TouchableHighlight, View, Alert, StyleSheet, AlertIOS} from 'react-native';
import PhotoBrowser from 'react-native-photo-browser';

export default class FolderDetail extends React.Component{
  render(){
    let {folder} = this.props;
    let mediaList = folder.screenshotList.map(screenshot=>{return{photo:screenshot.photo,selected:screenshot.selected}});
    return <Content>
      <Text>{folder.title}</Text>
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
  }
}
