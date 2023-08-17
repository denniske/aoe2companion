import React from 'react';
import Search from './components/search';
import { useNavigation } from '@react-navigation/native';
import { RootStackProp } from '../../App';
import {getTranslation} from '../helper/translate';


export default function SearchPage() {
    const navigation = useNavigation<RootStackProp>();

    const onSelect = async (user: any) => {
        navigation.push('User', {
            profileId: user.profileId,
            name: user.name,
        });
    };

    return <Search selectedUser={onSelect} actionText={getTranslation('search.show')} />;
}
