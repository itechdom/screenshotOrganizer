import {extendObservable, observable, computed, autorun, action, reaction} from 'mobx';
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
      }),
      addScreenshotToFolder:action((screenshot,folder)=>{
        folder.screenshotList.push(screenshot);
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

var screenshotOrganizerStore = new ScreenshotOrganizerStore();
export default screenshotOrganizerStore;
