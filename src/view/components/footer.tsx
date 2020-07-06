import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import {Menu} from 'react-native-paper';
import {RootStackParamList, RootStackProp} from '../../../App';
import {getRootNavigation} from "../../service/navigation";
import {useNavigationState} from "@react-navigation/native";
import {useNavigationStateExternal} from "../../hooks/use-navigation-state-external";

export default function Footer() {
    const [menu, setMenu] = useState(false);

    // const state = useNavigationState(state => state);
    // const activeRoute = state.routes[state.index];

    const nav = async (route: keyof RootStackParamList) => {
        const navigation = getRootNavigation();
        navigation.reset({
            index: 0,
            routes: [{name: route}]
        });
    };

    const navigationState = useNavigationStateExternal();
    const activeRoute = navigationState?.routes[navigationState.index];

    const iconStyle = (...routes: string[]) => {

        // const nav = getRootNavigation();
        // const state = nav?.getRootState();
        // const activeRoute = state?.routes[state.index];

        console.log('currentRoute', activeRoute?.name);

        const isActiveRoute = routes.includes(activeRoute?.name); // && activeRoute.params == null;
        return isActiveRoute ? styles.iconActive : styles.icon;
    };

    const iconSize = 22;

    return (
            <View style={styles.container}>
                <View style={styles.menu}>
                    <TouchableOpacity style={styles.menuButton} onPress={() => nav('Search')}>
                        <Icon name="search" size={iconSize} style={iconStyle('Search')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuButton} onPress={() => nav('Feed')}>
                        <Icon name="heart" size={iconSize} style={iconStyle('Feed')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuButton} onPress={() => nav('Main')}>
                        <Icon name="user" size={iconSize} style={iconStyle('Main')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuButton} onPress={() => nav('Leaderboard')}>
                        <Icon name="trophy" size={iconSize} style={iconStyle('Leaderboard')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuButton} onPress={() => nav('Civ')}>
                        <Icon5 name="landmark" size={iconSize} style={iconStyle('Civ')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuButton} onPress={() => nav('Guide')}>
                        <Icon name="graduation-cap" size={iconSize} style={iconStyle('Guide')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuButtonDots} onPress={() => setMenu(true)}>
                        <Icon name="ellipsis-v" size={iconSize} style={iconStyle('Tech', 'Unit', 'About')} />
                    </TouchableOpacity>
                    <Menu
                        contentStyle={{marginBottom: 50}}
                            visible={menu}
                            onDismiss={() => setMenu(false)}
                            anchor={
                                <View><Text> </Text></View>
                            }
                    >
                        <Menu.Item onPress={() => { nav('About'); setMenu(false); }} title="About" />
                        <Menu.Item onPress={() => { nav('Tech'); setMenu(false); }} title="Techs" />
                        <Menu.Item onPress={() => { nav('Unit'); setMenu(false); }} title="Units" />
                    </Menu>
                </View>
            </View>
    );
}

const styles = StyleSheet.create({
    menu: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-evenly',
        flex: 1,
        // backgroundColor: 'yellow',
    },
    icon: {
        color: '#999',
    },
    iconActive: {
        color: '#000',
    },
    menuButton: {
        // backgroundColor: 'blue',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        marginHorizontal: 2,
    },
    menuButtonDots: {
        // backgroundColor: 'blue',
        flex: 0.7,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        marginHorizontal: 2,
    },
    header: {
        // backgroundColor: 'blue',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    container: {
        // backgroundColor: 'blue',
        borderTopWidth: 1,
        borderTopColor: '#CCC',
        flexDirection: 'row',
        // marginBottom: 22,
        // marginBottom: 22,
        height: 48,
        // paddingTop: Platform.OS === 'ios' ? 0 : 6,
        // paddingBottom: Platform.OS === 'ios' ? 4 : 0,
        paddingLeft: 16,
        paddingRight: 12, // because of three dots icon
    },
});
