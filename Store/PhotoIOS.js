import {extendObservable, observable, computed, autorun, action, reaction, toJS} from 'mobx';
import RNPhotosFramework from 'react-native-photos-framework';

export const getPhotoListIOS = (loadFn,updateFn,updateFullFn) => {
  RNPhotosFramework.requestAuthorization().then((statusObj) => {
    if (statusObj.isAuthorized) {
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
        const album = queryResult.albums[0];
        const unsubscribeFunc = album.onChange((changeDetails, update) => {
          if(changeDetails.hasIncrementalChanges) {
            //Important! Assets must be supplied in original fetch-order.
            updateFn(update);
          }else {
            //Do full reload here..
            updateFullFn();
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
          //console.log("response from lib:",response);
          loadFn(response.assets);
        });
      });
    }
  })
}
