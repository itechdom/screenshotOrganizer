import React, { Component } from 'react';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Container, Content, Card, CardItem, Text, Body, Button } from 'native-base';
import {Alert, StyleSheet} from 'react-native';
import {observer} from 'mobx-react/native'

const FolderGrid =  observer(class FolderGrid extends Component {

  constructor(props){
    super(props);
  }

  render() {
    let folderList = this.props.folderList;
    return (
      <Container>
        <Content>
          {
            (folderList.length > 0)?
            folderList.map((folder)=>{
              <Card >
                <CardItem>
                  <Left>
                    <Body>
                      <Text>NativeBase</Text>
                      <Text note>GeekyAnts</Text>
                    </Body>
                  </Left>
                </CardItem>
                <CardItem cardBody>
                  Image Here ...
                </CardItem>
                <CardItem>
                  <Button transparent>
                    <Icon active name="thumbs-up" />
                    <Text>12 Likes</Text>
                  </Button>
                  <Button transparent>
                    <Icon active name="chatbubbles" />
                    <Text>4 Comments</Text>
                  </Button>
                  <Text>11h ago</Text>
                </CardItem>
              </Card>
            }):<Container style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop:50
            }}>
            <Button onPress={()=>Alert.alert("hello folder")}><Text>Create Folder</Text></Button>
          </Container>
        }
      </Content>
    </Container>
  );
}
});

const styles = StyleSheet.create({
  column:{
    flexDirection:'column'
  },
  row: {
    flexDirection:'row',
    justifyContent:'center'
  },
  image: {
    margin: 4,
    width:100,
    height:100
  }
});

export default FolderGrid;
