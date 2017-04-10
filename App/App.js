import React, { Component } from 'react'
import { View, Text, TextInput, TouchableHighlight, StyleSheet, Image, ScrollView } from 'react-native'
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
        <View style={styles.row}>
            {
              screenshotList.map((screenshot,index)=>
                <Image
                  source={{uri:"photos://AF14480A-609E-46BF-B694-653E950DA287/L0/001"}}
                  style={styles.image}
                  key={index}
                />
              )
            }
        </View>
      </View>
  }

})

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
    width:500,
    height:500
  }
});

export default App
