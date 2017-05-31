import React, { Component } from 'react'
import { View, Alert, Text, TextInput, Modal, TouchableHighlight, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native'
import { Container, Header, Title, Button, Left, Right, Body, Icon } from 'native-base';
import {observer} from 'mobx-react/native'
import PhotoBrowser from 'react-native-photo-browser';

const App = observer(class App extends Component {

  constructor (props) {
    super(props);
    this._onSelectionChanged = this._onSelectionChanged.bind(this);
    this._onActionButton = this._onActionButton.bind(this);
  }

  _onSelectionChanged(media, index, selected){
    console.log(`${media.photo} selection status: ${selected} index:${index}`);
  }

  _onActionButton(media, index){

  }

  render() {
    let media = this.props.screenshotList.map((screenshot,index)=>{
      return {
        photo:`assets-library://asset/asset.PNG?id=${screenshot.localIdentifier.replace("/L0/001","")}&ext=PNG`
      }
    })
    let topBarComponent = Text;
    return <View style={styles.container}>
      <PhotoBrowser
        mediaList={media}
        displayActionButton={true}
        renderTopBar={false}
        displaySelectionButtons={true}
        onSelectionChanged={this._onSelectionChanged}
        startOnGrid={true}
        topBarComponent={topBarComponent}
        onBack={()=>Alert.alert("Back!")}
      />
    </View>
  }

})

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  row: {
    flex: 1
  },
  image: {
    margin: 4,
    width:100,
    height:100
  }
});

export default App
