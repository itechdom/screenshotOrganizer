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
  Navigator
} from 'react-native';
import RNPhotosFramework from 'react-native-photos-framework';


import {observer} from 'mobx-react/native';

import ScreenshotOrganizerStore from './Store';

import App from './App/App.js';

class ScreenshotOrganizer extends React.Component {

  constructor(props){
    super(props);

  }

  renderScene (route, navigator) {
    return <route.component {...route.passProps} navigator={navigator} />
  }
  configureScene (route, routeStack) {
    if (route.type === 'Modal') {
      return Navigator.SceneConfigs.FloatFromBottom
    }
    return Navigator.SceneConfigs.PushFromRight
  }

  render() {

    return (
      <Navigator
      configureScene={this.configureScene.bind(this)}
      renderScene={this.renderScene.bind(this)}
      navigationBar={
        <Navigator.NavigationBar
        routeMapper={{
          LeftButton: (route, navigator, index, navState) =>
          { return (<Text>Cancel</Text>); },
          RightButton: (route, navigator, index, navState) =>
          { return (<Text>Done</Text>); },
          Title: (route, navigator, index, navState) =>
          { return (<Text>Screenshot Organizer</Text>); },
        }}
        style={{backgroundColor: 'gray'}}
        />
      }
      initialRoute={{
        component: App,
        passProps: {
          store: ScreenshotOrganizerStore
        }
      }} />
    );
  }

}

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

//refine images to fit the uri

//load photos
CameraRoll.getPhotos({
  groupTypes:'All',
  first:5
}).then((data)=>{
  data.edges.map((edge)=>{
    console.log(edge.node.image.uri);
  })
});


AppRegistry.registerComponent('screenshotOrganizer', () => ScreenshotOrganizer);
