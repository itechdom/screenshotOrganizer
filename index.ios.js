'use strict';

const React = require('react');
const ReactNative = require('react-native');
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
  AlertIOS
} from 'react-native';

import { Container, Header, Title, Button, Left, Right, Body, Icon, Tab, Tabs, Footer, FooterTab } from 'native-base';

import Autocomplete from 'react-native-autocomplete-input';

import RNPhotosFramework from 'react-native-photos-framework';

import {observer} from 'mobx-react/native';

import ScreenshotOrganizerStore from './Store';

import App from './App/App.js';
import FolderGrid from './App/FolderGrid.js';

const ScreenshotOrganizer = observer(class ScreenshotOrganizer extends React.Component {

  constructor(props){
    super(props);
    ScreenshotOrganizerStore.getFolder().then((res)=>{
      ScreenshotOrganizerStore.folderList.push(...JSON.parse(res));
    });
    RNPhotosFramework.requestAuthorization().then((statusObj) => {
      if (statusObj.isAuthorized) {
        console.log("statusObj",statusObj);
        RNPhotosFramework.getAlbums({
          type: 'smartAlbum',
          subType: 'smartAlbumScreenshots',
          assetCount: 'exact',
          fetchOptions: {
            sortDescriptors: [
              {
                key: 'title',
                ascending: true
              }
            ],
            sourceTypes:['none'],
            includeHiddenAssets: false,
            includeAllBurstAssets: false
          },
          //When you say 'trackInsertsAndDeletes or trackChanges' for an albums query result,
          //They will be cached and tracking will start.
          //Call queryResult.stopTracking() to stop this. ex. on componentDidUnmount
          trackInsertsAndDeletes: true,
          trackChanges: false

        }).then((queryResult) => {
          console.log(queryResult);
          const album = queryResult.albums[0];
          const unsubscribeFunc = album.onChange((changeDetails, update) => {
            if(changeDetails.hasIncrementalChanges) {
              //Important! Assets must be supplied in original fetch-order.
              update(ScreenshotOrganizerStore.screenshotList, (updatedAssetArray) => {
                ScreenshotOrganizerStore.screenshotList.replace(updatedAssetArray);
              },
              //If RNPF needs to retrive more assets to complete the change,
              //eg. a move happened that moved a previous out of array-index asset into your corrently loaded assets.
              //Here you can apply a param obj for options on how to load those assets. eg. ´includeMetadata : true´.
              {
                includeMetadata : true
              });
            }else {
              //Do full reload here..
            }
          });
          return album.getAssets({
            //The fetch-options from the outer query will apply here, if we get
            startIndex: 0,
            endIndex: 10,
            //When you say 'trackInsertsAndDeletes or trackAssetsChange' for an albums assets,
            //They will be cached and tracking will start.
            //Call album.stopTracking() to stop this. ex. on componentDidUnmount
            trackInsertsAndDeletes: true,
            trackChanges: false
          }).then((response) => {
            console.log("response from lib:",response);
            ScreenshotOrganizerStore.screenshotList.push(...response.assets);
          });
        });
      }
    });
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
              'Enter a Folder Name',
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
      <Tabs>
        <Tab heading="All">
          <App
            store={ScreenshotOrganizerStore}
            screenshotList={ScreenshotOrganizerStore.screenshotList}
          />
        </Tab>
        <Tab heading="Folders">
          <FolderGrid modalVisible={ScreenshotOrganizerStore.modalVisible} folderList={ScreenshotOrganizerStore.folderList} onFolderCreate={(text)=>ScreenshotOrganizerStore.addFolder(text)} />
        </Tab>
      </Tabs>
    </Container>
  );
}
})

const MoveModal = observer(class MoveModal extends React.Component {

  state = {
    query:""
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
                <Autocomplete
                  data={data}
                  defaultValue={query}
                  onChangeText={text => this.setState({ query: text })}
                  renderItem={data => (
                    <TouchableOpacity onPress={() => this.setState({ query: data })}>
                      <Text>{data}</Text>
                    </TouchableOpacity>
                  )}
                />
                <Button onPress={()=>this.props.toggleModal()}>
                  <Text>Submit</Text>
                </Button>
                <Button onPress={()=>this.props.toggleModal()}>
                  <Text>Cancel</Text>
                </Button>
              </View>
            </View>
          </Modal>
        </View>
      );
    }
  });


  AppRegistry.registerComponent('screenshotOrganizer', () => ScreenshotOrganizer);
