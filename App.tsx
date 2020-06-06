import React from 'react';
import Main from './src/main';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings(['Remote debugger']);

export default function App() {
    return (
            <Main/>
    );
}
