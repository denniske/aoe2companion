import { IQueueingPlayer } from '@app/api/socket/queueing';
import { Card } from '@app/components/card';
import { Icon } from '@app/components/icon';
import { Text } from '@app/components/text';
import { useTranslation } from '@app/helper/translate';
import { faMagnifyingGlass, faSwords } from '@fortawesome/sharp-solid-svg-icons';
import { formatAgo } from '@nex/data';
import React from 'react';
import { View } from 'react-native';

interface Props {
    player: IQueueingPlayer;
    // The queueing events carry profile ids only. The dashboards know the names of the players
    // they subscribed with, so they pass them in rather than us looking anything up.
    nameOf: (profileId: number) => string | undefined;
}

export const QueueingPlayer: React.FC<Props> = ({ player, nameOf }) => {
    const getTranslation = useTranslation();

    const name = nameOf(player.profileId) ?? player.profileId.toString();
    const party = player.partyProfileIds.map((profileId) => nameOf(profileId) ?? profileId.toString());

    return (
        <Card direction="vertical">
            <View className="flex-row items-center gap-2">
                <Icon icon={player.match ? faSwords : faMagnifyingGlass} size={14} color="subtle" />
                <Text variant="label">{name}</Text>
                <Text color="subtle">
                    {player.match ? getTranslation('matches.queueing.matched') : getTranslation('matches.queueing.searching')}
                </Text>
            </View>

            {party.length > 0 && (
                <Text variant="body-xs" color="subtle">
                    {getTranslation('matches.queueing.party', { players: party.join(', ') })}
                </Text>
            )}

            {/* Cancelling a search is invisible to us, so this says how old the information is
                rather than claiming the player is still searching right now. */}
            <Text variant="body-xs" color="subtle">
                {getTranslation('matches.queueing.since', { time: formatAgo(new Date(player.queueingSince)) })}
            </Text>
        </Card>
    );
};
