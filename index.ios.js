'use strict';
const React = require('react');
const ReactNative = require('react-native');
import { Navigation } from 'react-native-navigation';
import { registerScreens } from './Screens';

let ScreenshotOrganizerStore = new ScreenshotOrganizer();

registerScreens(ScreenshotOrganizerStore); // this is where you register all of your app's screens

// start the app
Navigation.startTabBasedApp({
  tabs: [
    {
      label: 'One',
      screen: 'example.FirstTabScreen', // this is a registered name for a screen
      icon: require('../img/one.png'),
      selectedIcon: require('../img/one_selected.png'), // iOS only
      title: 'Screen One'
    },
    {
      label: 'Two',
      screen: 'example.SecondTabScreen',
      icon: require('../img/two.png'),
      selectedIcon: require('../img/two_selected.png'), // iOS only
      title: 'Screen Two'
    }
  ]
});


  AppRegistry.registerComponent('screenshotOrganizer', () => ScreenshotOrganizerApp);
