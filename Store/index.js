import {extendObservable, observable, computed, autorun, action, reaction, toJS} from 'mobx';
import {getScreenshotList, createAlbum, loadAlbums, removeAssetFromAlbum, addAssetToAlbum} from './PhotoIOS.js';
import {FOLDER_IDENTIFIER} from '../Constants';
import {AsyncStorage} from 'react-native';
import uuidV4 from 'uuid/v4';

export class ScreenshotOrganizer {

  constructor() {
    extendObservable(this, {
      screenshotList : [],
      folderList:[],
      modalVisible:false,
      screenshotAlbum:{},
      mediaList:computed(()=>{
        return this.screenshotList.slice();
      }),
      selectScreenshot:action((media,index,selected)=>{
        this.screenshotList[index].selected = selected;
      }),
      getPhotoListIOS:action(()=>{
        getScreenshotList((response)=>{
          let screenshotList = response.map((screenshot)=>{
            return new Screenshot(`assets-library://asset/asset.PNG?id=${screenshot.localIdentifier.replace("/L0/001","")}&ext=PNG`,false,screenshot);
          })
          this.screenshotList.push(...screenshotList);
        },(update)=>{
          update(this.screenshotList, (updatedAssetArray) => {
            this.screenshotList.replace(updatedAssetArray);
          },
          //If RNPF needs to retrive more assets to complete the change,
          //eg. a move happened that moved a previous out of array-index asset into your corrently loaded assets.
          //Here you can apply a param obj for options on how to load those assets. eg. ´includeMetadata : true´.
          {
            includeMetadata : true
          });
        },()=>{
          //this is full reload
        },(album)=>{
          //this the album
          console.log("ALBUMFN",album);
          this.screenshotAlbum = album;
        });
      }),
      toggleModalVisible:action(()=>{
        this.modalVisible = !this.modalVisible;
      }),
      addFolder:action((folderTitle)=>{
        createAlbum(folderTitle+FOLDER_IDENTIFIER).then(album=>this.folderList.push(new Folder(folderTitle),album));
      }),
      addScreenshotListToFolder:action((folderTitle)=>{
        let selectedFolder = this.folderList.find((f)=>{
          return folderTitle === f.title;
        });
        selectedFolder.screenshotList.clear();
        let selectedPhotos = this.screenshotList.filter(screenshot=>screenshot.selected);
        selectedPhotos.map((screenshot)=>{console.log(screenshot.asset);addAssetToAlbum(screenshot.asset,selectedFolder.album)});
        selectedPhotos.map((screenshot)=>{console.log(screenshot.asset,this.screenshotAlbum);removeAssetFromAlbum(screenshot.asset,this.screenshotAlbum)});
        selectedFolder.screenshotList.push(...selectedPhotos.slice());
      }),
      getFolderList:action(()=>{
        loadAlbums().then((albums)=>{
          let folders = albums.map((album)=>new Folder(album.title.replace(FOLDER_IDENTIFIER,""),album));
          this.folderList.push(...folders);
        });
      }),
      getFolderDetails:action(()=>{

      })
    })
  }
}

export class Folder{
  id;
  title;
  album;
  constructor(title,album){
    this.album = album;
    extendObservable(this, {
      title:title,
      screenshotList:[]
    });
  }
}

export class Screenshot{
  id;
  photo = '';
  selected = false;
  asset;
  constructor(photo,selected,asset){
    this.asset = asset;
    extendObservable(this, {
      photo:photo,
      selected:selected
    });
  }
}
