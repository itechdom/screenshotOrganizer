import React, { Component } from 'react'
import { View, Alert, Text, TextInput, Modal, TouchableHighlight, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native'
import { Container, Header, Title, Button, Left, Right, Body, Icon } from 'native-base';
import {observer} from 'mobx-react/native'
import PhotoBrowser from './react-native-photo-browser/lib/index';

import {
  CameraRoll,
  Image,
  Slider,
  StyleSheet,
  Switch,
  Text,
  View,
  TouchableOpacity,
  AppRegistry,
  Navigator,
  Modal,
  TouchableHighlight,
  Alert,
  AlertIOS,
  PickerIOS,
  TextInput,
  NavigatorIOS
} from 'react-native';

import { Container, Header, Title, Button, Left, Right, Body, Icon, Tab, Tabs, Footer, FooterTab } from 'native-base';

import {observer} from 'mobx-react/native';

import { Navigation } from 'react-native-navigation';

import {ScreenshotOrganizer,Folder,Screenshot} from './Store';

let ScreenshotOrganizerStore;

const ScreenshotOrganizerApp = observer(class ScreenshotOrganizerApp extends React.Component {

  constructor(props){
    super(props);
    ScreenshotOrganizerStore = this.props.store;
    ScreenshotOrganizerStore.getFolderList();
    ScreenshotOrganizerStore.getPhotoListIOS();
  }

  render() {
    return (
      <Container>
        <MoveModal
          modalVisible={ScreenshotOrganizerStore.modalVisible}
          toggleModal={()=>{ScreenshotOrganizerStore.toggleModalVisible()}}
          folderNames={ScreenshotOrganizerStore.folderList.map(folder=>folder.title)}
          onSubmit={(folder)=>{console.log(folder)}}
        />
        <Header>
          <Left>
            <Button onPress={()=>AlertIOS.prompt(
              'New Folder',
              null,
              text => ScreenshotOrganizerStore.addFolder(text)
            )} transparent>
            <Icon name='ios-add' />
          </Button>
        </Left>
        <Body>
          <Title>Screenshot Organizer</Title>
        </Body>
        <Right>
          <Button onPress={()=>ScreenshotOrganizerStore.toggleModalVisible()} transparent>
            <Text>Move</Text>
          </Button>
        </Right>
      </Header>
      <PhotoBrowser
        mediaList={ScreenshotOrganizerStore.mediaList}
        displayActionButton={true}
        renderTopBar={false}
        displaySelectionButtons={true}
        onSelectionChanged={(media,index,selected)=>{ScreenshotOrganizerStore.selectScreenshot(media,index,selected)}}
        enableFullScreen={false}
        onLoadMore={()=>console.log("loading more from photo browser")}
        startOnGrid={true}
        topBarComponent={topBarComponent}
        onBack={()=>Alert.alert("Back!")}
      />
    </Container>
  );
}
})

const MoveModal = observer(class MoveModal extends React.Component {

  state = {
    selectedValue:"",
    text:""
  }

  render() {
    let data = this.props.folderNames;
    const { query } = this.state;
    return (
      <View style={{marginTop: 22}}>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.props.modalVisible}
          supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
            <View style={{marginTop: 22}}>
              <View>
                <Header>
                  <Left>
                    <Button onPress={()=>ScreenshotOrganizerStore.toggleModalVisible()} transparent>
                      <Text>Cancel</Text>
                    </Button>
                  </Left>
                  <Body>
                    <Title>Move To Folder</Title>
                  </Body>
                  <Right>
                    <Button onPress={()=>{ScreenshotOrganizerStore.addScreenshotListToFolder(this.state.selectedValue);ScreenshotOrganizerStore.toggleModalVisible()}} transparent>
                      <Text>Submit</Text>
                    </Button>
                  </Right>
                </Header>
                <TextInput
                  style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={(selectedValue) => this.setState({selectedValue})}
                  value={this.state.selectedValue}
                />
                <PickerIOS
                  selectedValue={this.state.selectedValue}
                  onValueChange={(selectedValue) => this.setState({selectedValue})}>
                  {data.map((title,index) => (
                    <PickerIOS.Item
                      key={index}
                      value={title}

                    />
                  ))}
                </PickerIOS>
              </View>
            </View>
          </Modal>
        </View>
      );
    }
  });



  export default App
