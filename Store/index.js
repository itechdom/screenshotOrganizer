import {extendObservable, observable, computed, autorun, action, reaction, toJS} from 'mobx';
import {getPhotoListIOS} from './PhotoIOS.js';
import {AsyncStorage} from 'react-native';
import uuidV4 from 'uuid/v4';

export class ScreenshotOrganizer {

  pendingRequestCount = 0;

  constructor() {
    extendObservable(this, {
      /* See previous listing */
      screenshotList : [],
      folderList:[],
      modalVisible:false,
      selectedPhotos:[],
      mediaList:computed(()=>{
        return this.screenshotList.map((screenshot,index)=>{
          return {
            photo:`assets-library://asset/asset.PNG?id=${screenshot.localIdentifier.replace("/L0/001","")}&ext=PNG`,
            selected:screenshot.selected
          }
        })
      }),
      getPhotoListIOS:action(()=>{
        getPhotoListIOS((response)=>{
          this.screenshotList.push(...response);
        },(updateFn)=>{

        },()=>{
          //this is full reload
        });
      }),
      selectScreenshot:action((media,index,selected)=>{
        this.screenshotList[index].selected = selected;
        // if(selected){
        //   this.selectedPhotos.push(media.photo);
        // }
      }),
      toggleModalVisible:action(()=>{
        this.modalVisible = !this.modalVisible;
      }),
      addFolder:action((folderTitle)=>{
        this.folderList.push(new Folder(folderTitle));
        this.saveFolder(this.folderList);
      }),
      addScreenshotListToFolder:action((folderTitle)=>{
        let selectedFolder = this.folderList.find((f)=>{
          return folderTitle === f.title;
        });
        selectedFolder.screenshotList.clear();
        selectedFolder.screenshotList.push(...this.selectedPhotos);
        this.selectedPhotos.clear();
      }),
      saveFolder:action((folderList)=>{
        return AsyncStorage.setItem('folderList', JSON.stringify(toJS(folderList)));
      }),
      getFolder:action(()=>{
        return new Promise((resolve,reject)=>{
          AsyncStorage.getItem('folderList', (err, result) => {
            if(err){
              return reject(err);
            }
            return resolve(result);
          });
        });
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
  constructor(id,photo,selected){
    extendObservable(this, {
      photo:photo,
      selected:selected
    });
  }
}
