import {observable, computed, autorun, action, reaction} from 'mobx';
import uuidV4 from 'uuid/v4';

class ScreenshotOrganizerStore {
  @observable imgList = [];
  pendingRequestCount = 0;
  constructor(imgList=[]) {
    this.imgList = imgList;
  }

  @computed get filterByDate(){
    return this.expenseList.filter(
      expense =>  expense.date === this.selectedDate
    );
  }

  @computed get fileNames(){
    return this.filesAccepted.map((file)=>file.name);
  }

  @action testRequest(){
    fetch('https://httpbin.org/ip')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
    })
    .catch((err)=>{
      console.error(err);
    })
  }
}

class Photo {
  id;
  title;
  constructor(id,title){
    this.id = uuidV4();
    this.title = title;
  }
}

var screenshotOrganizerStore = new ScreenshotOrganizerStore();
export default screenshotOrganizerStore;
