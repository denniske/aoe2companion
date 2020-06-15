import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import App from "./App";

class AppWrapper extends Component {
  render() {
    return (
        <App/>
    );
  }
}

AppRegistry.registerComponent('App', () => AppWrapper);