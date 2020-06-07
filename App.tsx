import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import MainPage from './src/view/main.page';
import { YellowBox } from 'react-native';
import NamePage from './src/view/name.page';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import Header from './src/view/header';

YellowBox.ignoreWarnings(['Remote debugger']);

export type RootStackParamList = {
    Main: undefined;
    Name: { name: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
    return (
            <PaperProvider>
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen
                                name="Main"
                                component={MainPage}
                                options={{ headerTitle: props => <Header {...props} /> }}
                        />
                        <Stack.Screen name="Name" component={NamePage} />
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
            // <NamePage/>
            // <Main/>
    );
}
