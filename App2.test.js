import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Tester, TestHookStore } from 'cavy';
// @ts-ignore
import ExampleSpec from './specs/exampleSpec';
import App from "./App";

const testHookStore = new TestHookStore();

class AppWrapper extends Component {
  render() {
    return (
      <Tester specs={[ExampleSpec]} store={testHookStore}>
        <App/>
      </Tester>
    );
  }
}

AppRegistry.registerComponent('App', () => AppWrapper);