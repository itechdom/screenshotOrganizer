import React, { Component } from 'react';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Container, Content, Card, CardItem, Body, Button, Icon, List, ListItem, Thumbnail } from 'native-base';
import {Modal, Text, TouchableHighlight, View, Alert, StyleSheet, AlertIOS} from 'react-native';
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

  _onActionButton(media, index){

  }

  render() {
    let folderList = this.props.folderList;
    return (
      (this.state.selectedFolder.title)?
      <Content>
        <Text>{selectedFolder.title}</Text>
        <Button onPress={()=>this.setState({selectedFolder:{}})} transparent>
          <Text>Back</Text>
        </Button>
        <PhotoBrowser
          mediaList={selectedFolder}
          displayActionButton={true}
          displayTopBar={false}
          renderTopBar={false}
          displaySelectionButtons={true}
          onSelectionChanged={this._onSelectionChanged}
          enableGrid={false}
        />
      </Content>
      :<Content>
        {
          (folderList.length > 0)?
          <Content>
          {folderList.map((folder)=>{
            return <List>
              <ListItem>
                {/* <Thumbnail square size={80} source={folder.screenshotList.first().} /> */}
                <Body>
                  <Text>{folder.title}</Text>
                  <Text note>Its time to build a difference . .</Text>
                </Body>
              </ListItem>
            </List>
          })}</Content>:<Container style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop:50
          }}>
          <Button onPress={()=>AlertIOS.prompt(
            'New Folder',
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
