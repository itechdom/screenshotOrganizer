import {extendObservable, observable, computed, autorun, action, reaction, toJS} from 'mobx';
import {getScreenshotList, createAlbum, loadAlbums} from './PhotoIOS.js';
import {AsyncStorage} from 'react-native';
import uuidV4 from 'uuid/v4';

export class ScreenshotOrganizer {

  constructor() {
    extendObservable(this, {
      screenshotList : [],
      folderList:[],
      modalVisible:false,
      mediaList:computed(()=>{
        return this.screenshotList.slice();
      }),
      selectScreenshot:action((media,index,selected)=>{
        this.screenshotList[index].selected = selected;
      }),
      getPhotoListIOS:action(()=>{
        getScreenshotList((response)=>{
          let screenshotList = response.map((screenshot)=>{
            return new Screenshot(`assets-library://asset/asset.PNG?id=${screenshot.localIdentifier.replace("/L0/001","")}&ext=PNG`,false);
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
        });
      }),
      toggleModalVisible:action(()=>{
        this.modalVisible = !this.modalVisible;
      }),
      addFolder:action((folderTitle)=>{
        this.folderList.push(new Folder(folderTitle));
        createAlbum(folderTitle);
        this.saveFolder(this.folderList);
      }),
      addScreenshotListToFolder:action((folderTitle)=>{
        let selectedFolder = this.folderList.find((f)=>{
          return folderTitle === f.title;
        });
        selectedFolder.screenshotList.clear();
        let selectedPhotos = this.screenshotList.filter(screenshot=>screenshot.selected);
        selectedFolder.screenshotList.push(...selectedPhotos.slice());
      }),
      getFolderList:action(()=>{
        loadAlbums().then((albums)=>{
          let folders = albums.map((album)=>new Folder(album.title));
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
  constructor(title,screenshotList=[]){
    extendObservable(this, {
      title:title,
      screenshotList:screenshotList
    });
  }
}

export class Screenshot{
  id;
  photo = '';
  selected = false;
  constructor(photo,selected){
    extendObservable(this, {
      photo:photo,
      selected:selected
    });
  }
}
