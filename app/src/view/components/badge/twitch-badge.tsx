import {Linking, Platform, StyleSheet, TouchableOpacity} from "react-native";
import React, {useEffect} from "react";
import {createStylesheet} from '../../../theming-new';
import Badge from './badge';
import {useLazyApi} from '../../../hooks/use-lazy-api';
import {twitchLive} from '../../../api/following';
import {openLink} from "../../../helper/url";


interface Props {
    channel: string;
}

export default function TwitchBadge(props: Props) {
    const { channel } = props;

    const playerTwitchLive = useLazyApi(
        {},
        twitchLive, channel
    );

    useEffect(() => {
        if (channel) {
            playerTwitchLive.reload();
        }
    }, [channel]);

    let content = undefined;
    if (playerTwitchLive.data?.viewer_count) {
        content = `${playerTwitchLive.data?.viewer_count} watching`;
    }

    return (
        <TouchableOpacity onPress={() => openLink(`https://www.twitch.tv/${channel}`)}>
            <Badge
                label="Twitch"
                labelColor="#6441a5"
                content={content}
                contentColor="#333638"
                logoIcon="twitch"
                logoColor="white"
                dot={!!content} />
        </TouchableOpacity>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({}));
