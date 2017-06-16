import { Navigation } from 'react-native-navigation';

import App from './App/App';
import FolderGrid from './App/FolderGrid';
import FolderDetail from './App/FolderDetail';

// register all screens of the app (including internal ones)
export function registerScreens() {
  Navigation.registerComponent('screenshotOrganizer.home', () => App);
  Navigation.registerComponent('screenshotOrganizer.folders', () => FolderGrid);
  Navigation.registerComponent('screenshotOrganizer.folders-detail', () => FolderDetail);
}
