import { TouchableOpacity } from 'react-native';
import React from 'react';
import Badge from './badge';
import { openLink } from '../../../helper/url';


interface Props {
    channelUrl: string;
}

export default function YoutubeBadge(props: Props) {
    const { channelUrl } = props;

    return (
        <TouchableOpacity onPress={() => openLink(channelUrl)}>
            <Badge
                label="Youtube"
                labelColor="#FF0233"
                // content={'100k subscribers'}
                // contentColor="#333638"
                logoIcon="youtube"
                logoColor="white" />
        </TouchableOpacity>
    );
}
