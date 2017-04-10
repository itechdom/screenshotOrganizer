import {extendObservable, observable, computed, autorun, action, reaction} from 'mobx';
import uuidV4 from 'uuid/v4';

class ScreenshotOrganizerStore {

  pendingRequestCount = 0;

  constructor() {
    this.screenshotList = [];
    this.folderList = ["Movies","Stores","Test"];
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
        this.folderList.push(folder);
      }),
      addScreenshotToFolder:action((screenshot,folder)=>{
        folder.screenshotList.push(folder);
      })
    })
  }
}

class Folder{
  id;
  screenshotList;
  title;
  constructor(title,screenshotList){
    this.title = title;
    this.screenshotList = screenshotList;
  }
}

class Screenshot {
  id;
  title;
  constructor(title){
    this.id = uuidV4();
    this.title = title;
  }
}

var screenshotOrganizerStore = new ScreenshotOrganizerStore();
export default screenshotOrganizerStore;
