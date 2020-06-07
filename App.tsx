import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import Main from './src/main';
import { YellowBox } from 'react-native';
import NamePage from './src/name.page';
import { createStackNavigator } from '@react-navigation/stack';

YellowBox.ignoreWarnings(['Remote debugger']);

const Stack = createStackNavigator();

export default function App() {
    return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                            name="Home"
                            component={Main}
                            options={{ title: 'Welcome', headerShown: false }}
                    />
                    <Stack.Screen name="Profile" component={NamePage} />
                </Stack.Navigator>
            </NavigationContainer>
            // <NamePage/>
            // <Main/>
    );
}
