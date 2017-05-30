import {extendObservable, observable, computed, autorun, action, reaction} from 'mobx';
import {AsyncStorage} from 'react-native';
import uuidV4 from 'uuid/v4';

class ScreenshotOrganizerStore {

  pendingRequestCount = 0;

  constructor() {
    extendObservable(this, {
      /* See previous listing */
      screenshotList : [],
      folderList:[],
      modalVisible:false,
      testRequest:action(()=>{
        fetch('https://httpbin.org/ip')
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
        })
        .catch((err)=>{
          console.error(err);
        })
      }),
      toggleModalVisible:action(()=>{
        this.modalVisible = !this.modalVisible;
      }),
      addFolder:action((folder)=>{
        this.folderList.push(new Folder(folder));
        this.saveFolder(this.folderList);
      }),
      addScreenshotToFolder:action((screenshot,folder)=>{
        folder.screenshotList.push(screenshot);
      }),
      saveFolder:action((folderList)=>{
        return AsyncStorage.setItem('folderList', JSON.stringify(folderList));
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

class Folder{
  id;
  title;
  constructor(title,screenshotList=[]){
    extendObservable(this, {
      title:this.title,
      screenshotList:this.screenshotList
    });
  }
}

class Screenshot{
  id;
  thumb = '';
  photo = '';
  caption = '';
  selected = false;
  constructor(id,thumb,photo,caption,selected){

  }
}

var screenshotOrganizerStore = new ScreenshotOrganizerStore();
export default screenshotOrganizerStore;
