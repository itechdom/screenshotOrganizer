import React from 'react';
import { Container, Content, Card, CardItem, Body, Button, Icon, List, ListItem, Thumbnail, Left, Right, Header, Title } from 'native-base';
import {Image, Modal, Text, TouchableHighlight, View, Alert, StyleSheet, AlertIOS} from 'react-native';
import PhotoBrowser from 'react-native-photo-browser';

export default class FolderDetail extends React.Component{
  render(){
    let {folder,onBackPress,onMove} = this.props;
    let mediaList = folder.screenshotList.map(screenshot=>{return{photo:screenshot.photo,selected:screenshot.selected}});
    return <Container>
      <Header>
        <Left>
          <Button onPress={onBackPress} transparent>
            <Icon name='arrow-back' />
          </Button>
        </Left>
        <Body>
          <Title>{folder.title}</Title>
        </Body>
        <Right>
          <Button onPress={()=>onMove(folder)} transparent>
            <Text>Move</Text>
          </Button>
        </Right>
      </Header>
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
    </Container>
  }
}
