import React, { Component } from 'react'
import { View, Text, TextInput, TouchableHighlight, StyleSheet, Image } from 'react-native'
import {observer} from 'mobx-react/native'
import DragDropTest from '../DragDropTest/example';
//import { Container, Header, Title, Button, Left, Right, Body, Icon } from 'native-base';

const App = observer(class App extends Component {

  constructor () {
    super()
  }

  render() {
    const { imgList } = this.props.store;
    return (
      <View style={styles.container}>
        <View style={styles.row}>
            <DragDropTest />
        </View>
      </View>
    );
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
    width:50,
    height:50
  }
});

export default App
