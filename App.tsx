import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import MainPage from './src/main.page';
import { YellowBox } from 'react-native';
import NamePage from './src/name.page';
import { createStackNavigator } from '@react-navigation/stack';

YellowBox.ignoreWarnings(['Remote debugger']);

export type RootStackParamList = {
    Main: undefined;
    Name: { name: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
    return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                            name="Main"
                            component={MainPage}
                            options={{ title: 'Welcome', headerShown: false }}
                    />
                    <Stack.Screen name="Name" component={NamePage} />
                </Stack.Navigator>
            </NavigationContainer>
            // <NamePage/>
            // <Main/>
    );
}
