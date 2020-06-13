import React, { useEffect, useState } from 'react';
import { AsyncStorage, FlatList, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { formatAgo } from '../helper/util';
import { IFetchedUser, loadUser } from '../service/user';
import { useLazyApi } from '../hooks/use-lazy-api';
import { Searchbar } from 'react-native-paper';
import { composeUserId, composeUserIdFromParts, UserId, UserInfo } from '../helper/user';
import Search from './search';
import { setAuth } from '../redux/reducer';
import { Link, useLinkTo } from '@react-navigation/native';

// Enter your AoE username to track your games:

export default function SearchPage({title, selectedUser}: any) {
    const linkTo = useLinkTo();

    const onSelect = async (user: UserInfo) => {
        linkTo('/user/' + user.id + '/' + user.name);
    };

    // <Link to={'/user/' + composeUserIdFromParts(player.steam_id, player.profile_id) + '/' + player.name} style={playerNameStyle}>{player.name}</Link>

    return <Search title="Search for user" selectedUser={onSelect}/>;
}
