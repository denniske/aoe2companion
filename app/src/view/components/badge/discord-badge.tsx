import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { createStylesheet } from '../../../theming-new';
import Badge from './badge';
import { discordOnline } from '../../../api/following';
import { openLink } from '../../../helper/url';
import { useQuery } from '@tanstack/react-query';

interface Props {
    invitation: string;
    invitationUrl: string;
}

export default function DiscordBadge(props: Props) {
    const { invitationUrl, invitation } = props;

    const { data: info } = useQuery({
        queryKey: ['discord-online', invitation!],
        queryFn: () => discordOnline(invitation!),
        enabled: !!invitation && !__DEV__,
    });

    let content = undefined;
    if (info?.approximate_presence_count) {
        content = `${info?.approximate_presence_count} online`;
    }

    return (
        <TouchableOpacity onPress={() => openLink(invitationUrl)}>
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
