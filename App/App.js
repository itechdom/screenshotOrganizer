import React, { Component } from 'react'
import { View, Button, Alert, Text, TextInput, TouchableHighlight, StyleSheet, Image, ScrollView } from 'react-native'
import Modal from 'react-native-modalbox';
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
    const { screenshotList } = this.props.store;
    return <View style={styles.container}>
    <Button
    onPress={()=>Alert.alert("Hello")}
    title="Add Folder"
    color="#841584"
    accessibilityLabel="Learn more about this purple button"
    />
    <ModalExample />
    <ScrollView style={styles.row}>
    {
      screenshotList.map((screenshot,index)=>
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

class ModalExample extends Component {

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
            <Text>Hello World!</Text>

            <TouchableHighlight onPress={() => {
              this.setModalVisible(!this.state.modalVisible)
            }}>
              <Text>Hide Modal</Text>
            </TouchableHighlight>

          </View>
         </View>
        </Modal>

        <TouchableHighlight onPress={() => {
          this.setModalVisible(true)
        }}>
          <Text>Show Modal</Text>
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
