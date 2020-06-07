import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import MainPage from './src/view/main.page';
import { Button, Image, StyleSheet, Text, View, YellowBox } from 'react-native';
import NamePage from './src/view/name.page';
import { createStackNavigator, HeaderBackground } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import Header from './src/view/header';
import Constants from 'expo-constants';
import { BlurView } from 'expo/build/removed.web';

YellowBox.ignoreWarnings(['Remote debugger']);

export type RootStackParamList = {
    Main: undefined;
    Name: { name: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const headerStatusBarHeight = 60;

export default function App() {
    return (
            <PaperProvider>
                <NavigationContainer>
                    {/*<View style={styles.header}>*/}
                    {/*    <Image style={styles.icon} source={require('./assets/icon.png')}/>*/}
                    {/*    <Text>AoE II Companion</Text>*/}
                    {/*</View>*/}
                    <Stack.Navigator screenOptions={{animationEnabled: false}}>
                        <Stack.Screen
                                name="Main"
                                component={MainPage}
                                options={{
                                    // title: 'asdas',
                                    // headerTransparent: true,
                                    // headerBackground: () => (
                                    //         <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
                                    // ),
                                    headerStatusBarHeight: headerStatusBarHeight,
                                    headerBackground: () => (
                                            <HeaderBackground><Header/></HeaderBackground>
                                    ),
                                    // headerTitle: props => <Header {...props} />,

                                    // headerStyle: styles.header,
                                    // headerRight: () => (
                                    //         <Button
                                    //                 onPress={() => alert('This is a button!')}
                                    //                 title="Info"
                                    //                 color="#fff"
                                    //         />
                                    // ),
                                }}
                        />
                        <Stack.Screen
                                name="Name"
                                component={NamePage}
                                options={{
                                    headerStatusBarHeight: headerStatusBarHeight,
                                    headerBackground: () => (
                                            <HeaderBackground><Header/></HeaderBackground>
                                    ),
                                }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
            // <NamePage/>
            // <Main/>
    );
}

const styles = StyleSheet.create({
    header: {
        marginTop: Constants.statusBarHeight,
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    icon: {
        width: 30,
        height: 30,
    },
});
