import {extendObservable, observable, computed, autorun, action, reaction, toJS} from 'mobx';
import RNPhotosFramework from 'react-native-photos-framework';

export class ScreenshotStore{

  pendingRequestCount = 0;

  constructor() {
    extendObservable(this, {
      /* See previous listing */
      screenshotList : [],
      getScreenshotList:action(()=>{
        RNPhotosFramework.requestAuthorization().then((statusObj) => {
          if (statusObj.isAuthorized) {
            console.log("statusObj",statusObj);
            RNPhotosFramework.getAlbums({
              type: 'smartAlbum',
              subType: 'smartAlbumScreenshots',
              assetCount: 'exact',
              fetchOptions: {
                sortDescriptors: [
                  {
                    key: 'title',
                    ascending: true
                  }
                ],
                sourceTypes:['none'],
                includeHiddenAssets: false,
                includeAllBurstAssets: false
              },
              //When you say 'trackInsertsAndDeletes or trackChanges' for an albums query result,
              //They will be cached and tracking will start.
              //Call queryResult.stopTracking() to stop this. ex. on componentDidUnmount
              trackInsertsAndDeletes: true,
              trackChanges: false

            }).then((queryResult) => {
              console.log(queryResult);
              const album = queryResult.albums[0];
              const unsubscribeFunc = album.onChange((changeDetails, update) => {
                if(changeDetails.hasIncrementalChanges) {
                  //Important! Assets must be supplied in original fetch-order.
                  update(ScreenshotOrganizerStore.screenshotList, (updatedAssetArray) => {
                    ScreenshotOrganizerStore.screenshotList.replace(updatedAssetArray);
                  },
                  //If RNPF needs to retrive more assets to complete the change,
                  //eg. a move happened that moved a previous out of array-index asset into your corrently loaded assets.
                  //Here you can apply a param obj for options on how to load those assets. eg. ´includeMetadata : true´.
                  {
                    includeMetadata : true
                  });
                }else {
                  //Do full reload here..
                }
              });
              return album.getAssets({
                //The fetch-options from the outer query will apply here, if we get
                startIndex: 0,
                endIndex: 10,
                //When you say 'trackInsertsAndDeletes or trackAssetsChange' for an albums assets,
                //They will be cached and tracking will start.
                //Call album.stopTracking() to stop this. ex. on componentDidUnmount
                trackInsertsAndDeletes: true,
                trackChanges: false
              }).then((response) => {
                console.log("response from lib:",response);
                ScreenshotOrganizerStore.screenshotList.push(...response.assets);
              });
            });
          }
        })
      })
    })
  }
}
