import React, { Component } from 'react';
import { Col, Row, Grid } from 'react-native-easy-grid';
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

  _onActionButton(media, index){

  }

  render() {
    let {folderList,screenshotList} = this.props;
    return (
      (this.state.selectedFolder.title)?
      <Content>
        <Text>{this.state.selectedFolder.title}</Text>
        <Button onPress={()=>this.setState({selectedFolder:{}})} transparent>
          <Text>Back</Text>
        </Button>
        <PhotoBrowser
          mediaList={[]}
          displayActionButton={true}
          displayTopBar={false}
          renderTopBar={false}
          displaySelectionButtons={true}
          onSelectionChanged={this._onSelectionChanged}
          enableGrid={false}
        />
      </Content>
      :<Container>
        {
          (folderList.length > 0)?
          <Content>
            <List>
              {folderList.map((folder,index)=>{
                let firstScreenshot = screenshotList[folder.screenshotList[0]];
                return <ListItem button key={index} onPress={()=>{console.log("hello");this.setState({selectedFolder:folder})}}>
                      {/* {
                        (folder.screenshotList.length > 0)?
                        <Image
                        style={{width: 50, height: 50}}
                        source={{uri: `assets-library://asset/asset.PNG?id=${firstScreenshot.localIdentifier.replace("/L0/001","")}&ext=PNG`}}
                      />
                      :
                      <Thumbnail square size={80} source={require('../img/empty-box.png')} />
                    } */}
                    <Thumbnail square size={80} source={require('../img/empty-box.png')} />
                    <Body>
                      <Text>{folder.title}</Text>
                      <Text note>{folder.screenshotList.length} Photos</Text>
                    </Body>
                    <Right>
                      <Icon name="arrow-forward" />
                    </Right>
              </ListItem>
            })}</List></Content>:<Container style={{
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
      </Container>
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
