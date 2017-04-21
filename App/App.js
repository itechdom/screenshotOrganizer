import React, { Component } from 'react'
import { View, Button, Alert, Text, TextInput, Modal, TouchableHighlight, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native'
import {observer} from 'mobx-react/native'
import DragDropTest from '../DragDropTest/example';
//import { Container, Header, Title, Button, Left, Right, Body, Icon } from 'native-base';

const App = observer(class App extends Component {

  constructor () {
    super()
  }

  //<DragDropTest
  //  folderList={this.props.store.folderList}
  //  screenshotList={this.props.store.screenshotList}
  // />

  render() {
    return <View style={styles.container}>
    <AddFolderModal
      onFolderCreate={(folder)=>this.props.store.addFolder(folder)}
    />
    {
      this.props.store.folderList.map((folder)=>{
        return <Text>{folder.title}</Text>
      })
    }
    <ScrollView style={styles.row}>
    {
      this.props.store.screenshotList.map((screenshot,index)=>
      <Image
      source={{uri:`assets-library://asset/asset.PNG?id=${screenshot.localIdentifier.replace("/L0/001","")}&ext=PNG`}}
      style={styles.image}
      key={index}
      />
    )
  }
  </ScrollView>
  </View>
}

})

class AddFolderModal extends Component {

  state = {
    modalVisible: false,
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View style={{marginTop: 22}}>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={{marginTop: 22}}>
           <View>
             <TextInput
               style={{height: 40, borderColor: 'gray', borderWidth: 1}}
               onChangeText={(text) => this.setState({text})}
               value={this.state.text}
             />
             <TouchableOpacity
               style={{margin: 5}}
               onPress={() => this.setModalVisible(!this.state.modalVisible)}>
               <Text>Close Me</Text>
             </TouchableOpacity>
             <TouchableOpacity
               style={{margin: 5}}
               onPress={() => {this.setModalVisible(!this.state.modalVisible);this.props.onFolderCreate(this.state.text)}}>
               <Text>Create Folder</Text>
             </TouchableOpacity>
           </View>
         </View>
        </Modal>

        <TouchableHighlight onPress={() => {
          this.setModalVisible(true)
        }}>
          <Text>Create Folder</Text>
        </TouchableHighlight>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    marginTop:100,
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
