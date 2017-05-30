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
      get filterByDate(){
        return this.expenseList.filter(
          expense =>  expense.date === this.selectedDate
        )
      },
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
      addFolder:action((folder)=>{
        this.folderList.push(new Folder(folder));
        this.saveFolder(this.folderList);
      }),
      removeFolder:action((folder)=>{
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
  screenshotList;
  title;
  constructor(title,screenshotList=[]){
    this.title = title;
    this.screenshotList = screenshotList;
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
