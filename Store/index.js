import {extendObservable, observable, computed, autorun, action, reaction, toJS} from 'mobx';
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
      selectedIndices:{},
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
      mediaList:computed(()=>{
        return this.screenshotList.map((screenshot,index)=>{
          return {
            photo:`assets-library://asset/asset.PNG?id=${screenshot.localIdentifier.replace("/L0/001","")}&ext=PNG`,
            selected:screenshot.selected
          }
        })
      }),
      selectScreenshot:action((index,selected)=>{
        //this.screenshotList[index].selected = selected;
        this.selectedIndices[index] = selected;
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
        selectedFolder.screenshotList.push(...Object.keys(this.selectedIndices));
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
  thumb = '';
  photo = '';
  caption = '';
  selected = false;
  constructor(id,thumb,photo,caption,selected){

  }
}
