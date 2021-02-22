import {Linking, Platform, StyleSheet, TouchableOpacity} from "react-native";
import React, {useEffect} from "react";
import {createStylesheet} from '../../../theming-new';
import Badge from './badge';
import {useLazyApi} from '../../../hooks/use-lazy-api';
import {discordOnline} from '../../../api/following';


interface Props {
    serverId?: string;
    invitationId?: string;
}

export default function DiscordBadge(props: Props) {
    const { serverId, invitationId } = props;

    const info = useLazyApi(
        {},
        discordOnline, serverId!
    );

    useEffect(() => {
        if (serverId) {
            info.reload();
        }
    }, [serverId]);

    let content = undefined;
    if (info.data?.presence_count) {
        content = `${info.data?.presence_count} online`;
    }

    const open = (url: string) => {
        return Platform.OS === 'web' ? window.open(url, '_blank') : Linking.openURL(url);
    };

    return (
        <TouchableOpacity onPress={() => open(`https://discord.gg/${invitationId}`)}>
            <Badge
                label="Discord"
                labelColor="#6B85CD"
                content={content}
                contentColor="#333638"
                logoSvg="https://raw.githubusercontent.com/badges/shields/fcf6678a127c9679b0d68284b860181c2580fe26/logo/discord.svg"
                logoColor="white" />
        </TouchableOpacity>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({}));
