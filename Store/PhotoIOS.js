import {extendObservable, observable, computed, autorun, action, reaction, toJS} from 'mobx';
import RNPhotosFramework from 'react-native-photos-framework';

export const getScreenshotList = (loadFn,updateFn,updateFullFn,albumFn) => {
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
        albumFn(album);
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

export const createAlbum = (title) => {
  RNPhotosFramework.createAlbum(title).then((album) => {
    return album;
  });
}

export const loadAlbums = ()=>{
  return RNPhotosFramework.getAlbums({
    type: 'album',
    subType: 'any',
    assetCount: 'exact',
    fetchOptions: {
      sortDescriptors : [
        {
          key: 'title',
          ascending: true
        }
      ],
      includeHiddenAssets: false,
      includeAllBurstAssets: false
    },
    //When you say 'trackInsertsAndDeletes or trackChanges' for an albums query result,
    //They will be cached and tracking will start.
    //Call queryResult.stopTracking() to stop this. ex. on componentDidUnmount
    trackInsertsAndDeletes : true,
    trackChanges : false

  }).then((queryResult) => {
    const albums = queryResult.albums;
    let screenshotOrganizerAlbums = albums.filter(album=>album.title.indexOf('screenshotorganizer')!== -1);
    return screenshotOrganizerAlbums;
  });
}

export const getAlbumAssets = (album) => {
  return album.getAssets({
    //The fetch-options from the outer query will apply here, if we get
    startIndex: 0,
    endIndex: 10,
    //When you say 'trackInsertsAndDeletes or trackAssetsChange' for an albums assets,
    //They will be cached and tracking will start.
    //Call album.stopTracking() to stop this. ex. on componentDidUnmount
    trackInsertsAndDeletes: false,
    trackChanges: false
  }).then((response) => {
    //console.log("response from lib:",response);
    return response.assets;
  });
}

export const addAssetToAlbum = (asset,album)=>{
  album.addAsset(asset).then(()=>{
    return;
  });
}

export const removeAssetFromAlbum = (asset,album)=>{
  return album.removeAsset(asset);
}

export const updateAlbumTitle = (title,album)=>{
  return album.updateTitle(title);
}

export const deleteAlbum = (album) => {
  return album.delete();
}

export const getAlbumMetadata = (album) => {
  return album.getMetadata().then((mutatedAlbumWithMetadata) => mutatedAlbumWithMetadata);
}

export const getAssetMetadata = (asset) => {
  return asset.getMetadata().then((mutatedAssetWithMetadata) => mutatedAssetWithMetadata);
}
