import React, { Component } from 'react';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Container, Content, Card, CardItem, Body, Button, Icon } from 'native-base';
import {Modal, Text, TouchableHighlight, View, Alert, StyleSheet, AlertIOS} from 'react-native';
import PhotoBrowser from 'react-native-photo-browser';
import {observer} from 'mobx-react/native'

const FolderGrid =  observer(class FolderGrid extends Component {

  constructor(props){
    super(props);
  }

  render() {
    let folderList = this.props.folderList;
    return (
      <Content>
        {
          (folderList.length > 0)?
          <Container style={{
              flexDirection: 'row'
            }}>
          {folderList.map((folder)=>{
            return <Card>
              <CardItem>
                <Text>{folder.title}</Text>
              </CardItem>
              <CardItem cardBody>
                <Text>Image Here ...</Text>
              </CardItem>
              <CardItem>
                <Button transparent>
                  <Icon active name="thumbs-up" />
                  <Text>12 Likes</Text>
                </Button>
                <Button transparent>
                  <Icon active name="chatbubbles" />
                  <Text>4 Comments</Text>
                </Button>
                <Text>11h ago</Text>
              </CardItem>
            </Card>
          })}</Container>:<Container style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop:50
          }}>
          <Button onPress={()=>AlertIOS.prompt(
            'Enter a Folder Name',
            null,
            text => this.props.onFolderCreate(text)
          )}><Text>Create Folder</Text></Button>
        </Container>
      }
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
