import React from 'react';
import Search from './components/search';
import { useNavigation } from '@react-navigation/native';
import { RootStackProp } from '../../App';
import {getTranslation} from '../helper/translate';
import SearchQuery from "./components/search-query";


export default function QueryPage() {
    const navigation = useNavigation<RootStackProp>();

    const onSelect = async (user: any) => {
        navigation.push('User', {
            profileId: user.profileId,
            name: user.name,
        });
    };

    return <SearchQuery selectedUser={onSelect} actionText={getTranslation('search.show')} />;
}
