import { IQueueingItem } from '@app/api/socket/queueing';
import { Card } from '@app/components/card';
import { Icon } from '@app/components/icon';
import { Text } from '@app/components/text';
import { useTranslation } from '@app/helper/translate';
import { faMagnifyingGlass, faSwords } from '@fortawesome/sharp-solid-svg-icons';
import { formatAgo } from '@nex/data';
import { Image } from 'expo-image';
import { groupBy, sortBy } from 'lodash';
import React, { Fragment, useMemo } from 'react';
import { View } from 'react-native';

type NameOf = (profileId: number) => string | undefined;

interface Props {
    item: IQueueingItem;
    // The events carry every player's name. This only overrides it where the page has a better
    // one for somebody, such as "You".
    nameOf?: NameOf;
    // Whose card this is: on a match card, these are named at the top. Everyone in it if omitted.
    subjectProfileIds?: number[];
}

export const QueueingPlayer: React.FC<Props> = ({ item, nameOf, subjectProfileIds }) => {
    const getTranslation = useTranslation();

    const name = (player: { profileId: number; name: string }) => nameOf?.(player.profileId) ?? player.name ?? player.profileId.toString();

    // The subject of the sentence: the party while searching, and the players this page follows
    // once matched -- the whole match roster is shown below.
    const subjects = item.status === 'queueing'
        ? item.players
        : item.players.filter((p) => subjectProfileIds == null || subjectProfileIds.includes(p.profileId));
    const subjectNames = subjects.map(name);

    const teams = useMemo(
        () => (item.status === 'matched' ? sortBy(Object.entries(groupBy(item.players, (p) => p.team)), ([team]) => team) : []),
        [item]
    );

    return (
        <Card direction="vertical">
            <View className="flex-row items-center gap-2 flex-wrap">
                <Icon icon={item.status === 'matched' ? faSwords : faMagnifyingGlass} size={14} color="subtle" />

                {subjectNames.map((playerName, index) => (
                    <Fragment key={index}>
                        {index !== 0 && <Text color="subtle">+</Text>}
                        <Text variant="label">{playerName}</Text>
                    </Fragment>
                ))}

                <Text color="subtle">
                    {item.status === 'matched'
                        ? getTranslation(subjectNames.length > 1 ? 'matches.queueing.matched.plural' : 'matches.queueing.matched')
                        : getTranslation(subjectNames.length > 1 ? 'matches.queueing.searching.plural' : 'matches.queueing.searching')}
                </Text>
            </View>

            {/* The roster and sides are known a minute before the match reaches the ongoing list.
                The map can still change until it starts. */}
            {item.status === 'matched' && (
                <View className="flex-row items-start gap-3">
                    {!!item.mapImageUrl && (
                        <Image className="w-14 h-14 md:w-20 md:h-20" source={{ uri: item.mapImageUrl }} contentFit="cover" />
                    )}
                    <View className="gap-1 flex-1">
                        <View className="flex-row items-start flex-wrap" style={{ columnGap: 12 }}>
                            {teams.map(([team, players], index) => (
                                <Fragment key={team}>
                                    {index !== 0 && <Text variant="label">{getTranslation('match.versus')}</Text>}
                                    <View>
                                        {players.map((p) => (
                                            <Text key={p.profileId}>
                                                {name(p)}
                                                {p.rating != null && <Text color="subtle"> ({p.rating})</Text>}
                                            </Text>
                                        ))}
                                    </View>
                                </Fragment>
                            ))}
                        </View>
                        {!!item.mapName && <Text variant="label-sm">{item.mapName}</Text>}
                        <Text variant="body-xs" color="subtle">
                            {item.server} · {item.matchId}
                        </Text>
                    </View>
                </View>
            )}

            {/* Cancelling a search is invisible to us, so this says how old the information is
                rather than claiming the player is still searching right now. */}
            {item.status === 'queueing' && (
                <Text variant="body-xs" color="subtle">
                    {getTranslation('matches.queueing.since', { time: formatAgo(new Date(item.queueingSince)) })}
                </Text>
            )}
        </Card>
    );
};
