import React, { useEffect, useState } from 'react';
import { AsyncStorage, FlatList, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { formatAgo } from '../helper/util';
import { IFetchedUser, loadUser } from '../service/user';
import { useLazyApi } from '../hooks/use-lazy-api';
import { Searchbar } from 'react-native-paper';
import { composeUserId, composeUserIdFromParts, UserId, userIdFromBase, UserInfo } from '../helper/user';
import Search from './components/search';
import { setAuth } from '../redux/reducer';
import { Link, useLinkTo, useNavigation } from '@react-navigation/native';
import { RootStackProp } from '../../App';

export default function SearchPage({title, selectedUser}: any) {
    const navigation = useNavigation<RootStackProp>();

    const onSelect = async (user: UserInfo) => {
        navigation.push('User', {
            id: user,
            name: user.name,
        });
    };

    // <Link to={'/user/' + composeUserIdFromParts(player.steam_id, player.profile_id) + '/' + player.name} style={playerNameStyle}>{player.name}</Link>

    return <Search title="Search for user" selectedUser={onSelect}/>;
}
