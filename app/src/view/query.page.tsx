import React from 'react';
import { UserInfo } from '../helper/user';
import Search from './components/search';
import { useNavigation } from '@react-navigation/native';
import { RootStackProp } from '../../App';
import {getTranslation} from '../helper/translate';
import SearchQuery from "./components/search-query";


export default function QueryPage() {
    const navigation = useNavigation<RootStackProp>();

    const onSelect = async (user: UserInfo) => {
        navigation.push('User', {
            id: user,
            name: user.name,
        });
    };

    return <SearchQuery selectedUser={onSelect} actionText={getTranslation('search.show')} />;
}
