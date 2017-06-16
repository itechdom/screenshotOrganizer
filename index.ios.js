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
      screen: 'screenshotOrganizer.home', // this is a registered name for a screen
      title: 'Screen One'
    },
    {
      label: 'Two',
      screen: 'screenshotOrganizer.folders',
      title: 'Screen Two'
    }
  ]
});
