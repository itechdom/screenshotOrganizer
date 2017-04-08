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

import {observer} from 'mobx-react/native';

import ScreenshotOrganizerStore from './Store';

import App from './App/App.js';

class ScreenshotOrganizer extends React.Component {

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

//load photos
CameraRoll.getPhotos({
  groupTypes:'All',
  first:5
}).then((data)=>{
  console.log(data);
  ScreenshotOrganizerStore.imgList.push(...data.edges);
});



AppRegistry.registerComponent('screenshotOrganizer', () => ScreenshotOrganizer);
