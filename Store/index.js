import {extendObservable, observable, computed, autorun, action, reaction} from 'mobx';
import uuidV4 from 'uuid/v4';

class ScreenshotOrganizerStore {

  pendingRequestCount = 0;

  constructor(imgList=[]) {
    this.imgList = imgList;
    extendObservable(this, {
      /* See previous listing */
      imgList : [],
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
      })
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
