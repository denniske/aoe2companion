import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { createStylesheet } from '../../../theming-new';
import Badge from './badge';
import { twitchLive } from '../../../api/following';
import { openLink } from '../../../helper/url';
import { useQuery } from '@tanstack/react-query';
import { IPlayerNew } from '@app/api/helper/api.types';
import { MyText } from '@app/view/components/my-text';
import { FontAwesome5 } from '@expo/vector-icons';

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

    let label: string;
    let content: string;
    if (condensed) {
        label = '';
        content = playerTwitchLive?.viewer_count ? `` : '';
    } else {
        label = 'Twitch';
        content = playerTwitchLive?.viewer_count ? `${playerTwitchLive.viewer_count} watching` : '';
    }

    return (
        <TouchableOpacity onPress={() => openLink(channelUrl)}>
            <Badge
                label={label}
                labelColor="#6441a5"
                content={content}
                contentColor="#333638"
                logoIcon="twitch"
                logoColor="white"
                dot={!!playerTwitchLive?.viewer_count && !condensed}
            />
        </TouchableOpacity>
    );
}

const useStyles = createStylesheet((theme) => StyleSheet.create({}));


export function ProfileLive({ data }: { data: IPlayerNew }) {
    const styles = useStyles();
    const { socialTwitchChannel, socialTwitchChannelUrl } = data;

    const { data: playerTwitchLive } = useQuery({
        queryKey: ['twitch-live', socialTwitchChannel],
        queryFn: () => twitchLive(socialTwitchChannel),
        enabled: !!socialTwitchChannel,
    });

    if (!playerTwitchLive || !socialTwitchChannel || !socialTwitchChannelUrl) {
        return <MyText />;
    }

    // const socialTwitchChannelUrl = "https://twitch.tv/example";
    // const playerTwitchLive = {
    //     type: 'live',
    //     viewer_count: 10,
    // }

    return (
        <MyText onPress={() => openLink(socialTwitchChannelUrl)}>
            {playerTwitchLive?.type === 'live' && (
                <>
                    <MyText style={{ color: '#e91a16' }}> ● </MyText>
                    <MyText>{playerTwitchLive.viewer_count} </MyText>
                    <FontAwesome5 solid name="twitch" size={14} />
                    <MyText> </MyText>
                </>
            )}
        </MyText>
    );
}
