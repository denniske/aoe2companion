import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {IconButton, Menu} from 'react-native-paper';
import {RootStackParamList, RootStackProp} from '../../../App';
import {useCavy} from "cavy";

export default function Header() {
    const generateTestHook = useCavy();

    const [menu, setMenu] = useState(false);

    const navigation = useNavigation<RootStackProp>();

    const nav = async (route: keyof RootStackParamList) => {
        navigation.reset({
            index: 0,
            routes: [{name: route}]
        });
    };

    return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image style={styles.icon} source={require('../../../assets/icon.png')}/>
                    <Text>AoE II Companion</Text>
                </View>
                <View style={styles.menu}>
                    <IconButton
                        style={styles.menuButton}
                        size={18}
                        icon={({size, color}) => (<Icon name="trophy" color={color} size={size}/>)}
                        onPress={() => nav('Leaderboard')}
                        ref={generateTestHook('Header.Leaderboard') as any}
                    />
                    <IconButton
                        style={styles.menuButton}
                        size={18}
                        icon={({size, color}) => (<Icon name="search" color={color} size={size}/>)}
                        onPress={() => nav('Search')}
                        ref={generateTestHook('Header.Search') as any}
                    />
                    <IconButton
                        style={styles.menuButton}
                        size={18}
                        icon={({size, color}) => (<Icon name="user" color={color} size={size}/>)}
                        onPress={() => nav('Main')}
                        ref={generateTestHook('Header.User') as any}
                    />
                    <Menu
                            visible={menu}
                            onDismiss={() => setMenu(false)}
                            anchor={
                                <IconButton
                                    style={styles.menuButtonDots}
                                    size={18}
                                    icon={({size, color}) => (<Icon name="ellipsis-v" color={color} size={size}/>)}
                                    onPress={() => setMenu(true)}
                                />
                            }
                    >
                        <Menu.Item onPress={() => { nav('About'); setMenu(false); }} title="About" />
                    </Menu>
                </View>
            </View>
    );
}

const styles = StyleSheet.create({
    menu: {
        // backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuButton: {
        // backgroundColor: 'blue',
        margin: 0,
        marginLeft: 4,
    },
    menuButtonDots: {
        // backgroundColor: 'blue',
        margin: 0,
        marginLeft: 0,
    },
    header: {
        // backgroundColor: 'blue',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        marginRight: 5,
        width: 30,
        height: 30,
    },
    container: {
        // backgroundColor: 'blue',
        flexDirection: 'row',
        marginTop: Constants.statusBarHeight,
        height: 36,
        paddingTop: Platform.OS === 'ios' ? 0 : 6,
        paddingBottom: Platform.OS === 'ios' ? 4 : 0,
        paddingLeft: 16,
        paddingRight: 12, // because of three dots icon
    },
});
