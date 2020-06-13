import { Image, Picker, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Constants from 'expo-constants';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useLinkTo } from '@react-navigation/native';
import { Menu } from 'react-native-paper';

export default function Header() {
    const [menu, setMenu] = useState(false);
    const linkTo = useLinkTo();

    return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image style={styles.icon} source={require('../../assets/icon.png')}/>
                    <Text>AoE II Companion</Text>
                </View>
                <View style={styles.menu}>
                    <TouchableOpacity onPress={() => linkTo('/search')}>
                        <FontAwesomeIcon style={styles.menuButton} name="search" size={18} />
                    </TouchableOpacity>

                    {/*<TouchableOpacity onPress={() => linkTo('/main')}>*/}
                    {/*    <FontAwesomeIcon style={styles.menuButton} name="user" size={18} />*/}
                    {/*</TouchableOpacity>*/}

                    <Menu
                            visible={menu}
                            onDismiss={() => setMenu(false)}
                            anchor={
                                <TouchableOpacity onPress={() => setMenu(true)}>
                                    <FontAwesomeIcon style={styles.menuButton} name="ellipsis-v" size={18} />
                                </TouchableOpacity>
                            }
                    >
                        <Menu.Item onPress={() => { linkTo('/about'); setMenu(false); }} title="About" />
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
        marginLeft: 20,
    },
    header: {
        // backgroundColor: 'blue',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        width: 30,
        height: 30,
    },
    container: {
        flexDirection: 'row',
        marginTop: Constants.statusBarHeight,
        flex: 1,
        marginBottom: 45,
        paddingLeft: 16,
        paddingRight: 16,
    },
});
