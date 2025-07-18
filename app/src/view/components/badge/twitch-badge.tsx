import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { createStylesheet } from '../../../theming-new';
import Badge from './badge';
import { twitchLive } from '../../../api/following';
import { openLink } from '../../../helper/url';
import { useQuery } from '@tanstack/react-query';

interface Props {
    channel?: string;
    channelUrl?: string;
    condensed?: boolean;
}

export default function TwitchBadge(props: Props) {
    const { channelUrl, channel, condensed } = props;

    if (!channel || !channelUrl) return null;

    const { data: playerTwitchLive } = useQuery({
        queryKey: ['twitch-live', channel],
        queryFn: () => twitchLive(channel),
    });

    let content = undefined;
    if (playerTwitchLive?.viewer_count) {
        content = `${playerTwitchLive?.viewer_count}${condensed ? '' : ' watching'}`;
    }

    return (
        <TouchableOpacity onPress={() => openLink(channelUrl)}>
            <Badge
                label={!condensed ? 'Twitch' : ''}
                labelColor="#6441a5"
                content={content ? content : condensed ? 'Offline' : undefined}
                contentColor="#333638"
                logoIcon="twitch"
                logoColor="white"
                dot={!!content}
            />
        </TouchableOpacity>
    );
}

const useStyles = createStylesheet((theme) => StyleSheet.create({}));
