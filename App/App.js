import React, { Component } from 'react'
import { View, Alert, Text, TextInput, Modal, TouchableHighlight, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native'
import { Container, Header, Title, Button, Left, Right, Body, Icon } from 'native-base';
import { observer } from 'mobx-react/native'
import PhotoBrowser from './react-native-photo-browser/lib/index';

const App = observer(class App extends Component {

  constructor(props) {
    super(props);
    this._onSelectionChanged = this._onSelectionChanged.bind(this);
    this._onActionButton = this._onActionButton.bind(this);
  }

  _onSelectionChanged(media, index, selected) {
    this.props.onSelectionChanged(media, index, selected);
  }

  _onActionButton(media, index) {
  }

  openModal() {
    this.props.onOpenModal();
  }

  closeModal() {
    this.props.onCloseModal();
  }

  render() {
    let topBarComponent = Text;
    let mediaList = this.props.mediaList;
    let store = this.props.store;
    return <View style={styles.container}>
      <Modal
        visible={this.props.modalVisible}
        animationType={'slide'}
        onRequestClose={() => this.closeModal()}
      >
        <View>
          <View>
            <Text>This is content inside of modal component</Text>
            <Button
              onPress={() => this.closeModal()}
              title="Close modal"
            >
            </Button>
          </View>
        </View>
      </Modal>
      <PhotoBrowser
        mediaList={mediaList}
        displayActionButton={true}
        renderTopBar={false}
        displaySelectionButtons={true}
        onSelectionChanged={this._onSelectionChanged}
        enableFullScreen={false}
        onLoadMore={() => store.getNextPhotoListIOS()}
        canLoadMore={store.canLoadMore}
        onLongPress={this.openModal}
        startOnGrid={true}
        topBarComponent={topBarComponent}
        onBack={() => Alert.alert("Back!")}
      />
    </View>
  }

})

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flex: 1
  },
  image: {
    margin: 4,
    width: 100,
    height: 100
  }
});

export default App
