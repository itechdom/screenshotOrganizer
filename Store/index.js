import {extendObservable, observable, computed, autorun, action, reaction, toJS} from 'mobx';
import {getScreenshotList, createAlbum, loadAlbums, loadDeletedAlbum, removeAssetFromAlbum, addAssetToAlbum, getAlbumAssets} from './PhotoIOS.js';
import {FOLDER_IDENTIFIER, DELETED_KEY} from '../Constants';
import {AsyncStorage} from 'react-native';
import uuidV4 from 'uuid/v4';

export class ScreenshotOrganizer {

  constructor() {
    extendObservable(this, {
      itemsPerPage:10,
      page:-1,
      canLoadMore:true,
      originalScreenshotList:[],
      screenshotList : [],
      folderList:[],
      modalVisible:false,
      screenshotAlbum:{},
      deletedScreenshotList:[],
      mediaList:computed(()=>{
        return this.screenshotList.slice();
      }),
      init:action(async ()=>{
        let deletedScreenshotList = await this.getDeletedScreenshots();
        this.deletedScreenshotList.push(...deletedScreenshotList);
      }),
      selectScreenshot:action((media,index,selected)=>{
        this.screenshotList[index].selected = selected;
      }),
      saveOriginalScreenshotList:action((screenshotList)=>{
        if(this.originalScreenshotList.length === 0){
          this.originalScreenshotList = screenshotList;
        }
      }),
      processScreenshotList:action((screenshotList)=>{
        return screenshotList.map((screenshot)=>{
          return new Screenshot(`assets-library://asset/asset.PNG?id=${screenshot.localIdentifier.replace("/L0/001","")}&ext=PNG`,false,screenshot);
        }).map((screenshot)=>{
          let deleted = this.deletedScreenshotList.find((localIdentifier)=>{return localIdentifier === screenshot.asset.localIdentifier});
          screenshot.deleted = !!deleted;
          return screenshot;
        });
      }),
      getPhotoListIOS:action(()=>{
        this.page++;
        let startIndex =  this.page * this.itemsPerPage;
        let endIndex = (this.page+1)*this.itemsPerPage;
        getScreenshotList(startIndex, endIndex, (response)=>{
          console.log("FETCHING MORE ...",response);
          let screenshotList = this.processScreenshotList(response);
          this.screenshotList.push(...screenshotList);
        },(update)=>{
          update(this.screenshotList.map(screenshot=>screenshot.asset), (response) => {
            let screenshotList = this.processScreenshotList(response);
            this.screenshotList.clear();
            this.screenshotList.push(...screenshotList);
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
        selectedPhotos.map((screenshot)=>{addAssetToAlbum(screenshot.asset,selectedFolder.album)});
        selectedPhotos.map((screenshot)=>{this.deleteScreenshot(screenshot)});
        selectedFolder.screenshotList.push(...selectedPhotos.slice());
      }),
      deleteScreenshot:action(async (screenshot)=>{
        screenshot.deleted = true;
        let deleted = await this.saveDeletedScreenshot(screenshot);
      }),
      getFolderList:action(()=>{
        loadAlbums().then((albums)=>{
          let folders = albums.map((album)=>new Folder(album.title.replace(FOLDER_IDENTIFIER,""),album));
          this.folderList.push(...folders);
        });
      }),
      getFolderDetails:action((folder)=>{
        getAlbumAssets(folder.album).then(assets=>assets.map((asset)=>{
          let screenshot = new Screenshot(`assets-library://asset/asset.PNG?id=${asset.localIdentifier.replace("/L0/001","")}&ext=PNG`,false,asset);
          folder.screenshotList.push(screenshot);
        })
      );
    }),
    getDeletedScreenshots:action(async () => {
      try {
        const value = await AsyncStorage.getAllKeys();
        if (value !== null){
          return value
        }
        else{
          return [];
        }
      } catch (error) {
        // Error retrieving data
      }
    }),
    saveDeletedScreenshot:action(async (screenshot) => {
      try {
        let deleted = await AsyncStorage.setItem(screenshot.asset.localIdentifier, JSON.stringify(screenshot));
      } catch (error) {
        // Error saving data
        console.log("ERROR setting deleted");
      }
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
  deleted;
  constructor(photo,selected,asset){
    this.asset = asset;
    this.deleted = false;
    extendObservable(this, {
      photo:photo,
      selected:selected
    });
  }
}
