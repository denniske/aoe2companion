import { fetchProfiles } from '@app/api/helper/api';
import { IQueueingPlayer } from '@app/api/socket/queueing';
import { Card } from '@app/components/card';
import { Icon } from '@app/components/icon';
import { Text } from '@app/components/text';
import { useTranslation } from '@app/helper/translate';
import { useLanguage } from '@app/queries/all';
import { faMagnifyingGlass, faSwords } from '@fortawesome/sharp-solid-svg-icons';
import { formatAgo } from '@nex/data';
import { groupBy, sortBy, uniq } from 'lodash';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

type NameOf = (profileId: number) => string | undefined;

interface Props {
    player: IQueueingPlayer;
    // Queueing events carry profile ids only. Names come from whatever the page already knows --
    // the account, its followed players -- and fall back to the id.
    nameOf: NameOf;
}

export const QueueingPlayer: React.FC<Props> = ({ player, nameOf }) => {
    const getTranslation = useTranslation();

    const name = (profileId: number) => nameOf(profileId) ?? profileId.toString();
    const party = player.partyProfileIds.map(name);

    const teams = useMemo(
        () => sortBy(Object.entries(groupBy(player.match?.players ?? [], (p) => p.team)), ([team]) => team),
        [player.match]
    );

    return (
        <Card direction="vertical">
            <View className="flex-row items-center gap-2 flex-wrap">
                <Icon icon={player.match ? faSwords : faMagnifyingGlass} size={14} color="subtle" />
                <Text variant="label">{name(player.profileId)}</Text>
                <Text color="subtle">
                    {player.match
                        ? getTranslation('matches.queueing.matched')
                        : party.length > 0
                          ? getTranslation('matches.queueing.searching.with', { players: party.join(', ') })
                          : getTranslation('matches.queueing.searching')}
                </Text>
            </View>

            {/* Once matched, the advertisement names everyone in the match and which side they are
                on -- a minute before the match reaches the ongoing list. There is no map: the
                advertisement's map field is the host's own setting, not what the matchmaker
                picked, and it disagrees with the played map about half the time. */}
            {!!player.match && (
                <View className="gap-1">
                    <View className="flex-row items-start flex-wrap" style={{ columnGap: 12 }}>
                        {teams.map(([team, players], index) => (
                            <Fragment key={team}>
                                {index !== 0 && <Text variant="label">{getTranslation('match.versus')}</Text>}
                                <View>
                                    {players.map((p) => (
                                        <Text key={p.profileId}>{name(p.profileId)}</Text>
                                    ))}
                                </View>
                            </Fragment>
                        ))}
                    </View>
                    <Text variant="body-xs" color="subtle">
                        {player.match.server} · {player.match.matchId}
                    </Text>
                </View>
            )}

            {/* Cancelling a search is invisible to us, so this says how old the information is
                rather than claiming the player is still searching right now. */}
            <Text variant="body-xs" color="subtle">
                {getTranslation('matches.queueing.since', { time: formatAgo(new Date(player.queueingSince)) })}
            </Text>
        </Card>
    );
};

/**
 * Resolves every profile id a set of queueing entries mentions -- the player, their party and,
 * once matched, everyone in the match. Each id is fetched once and kept, so a player who stops
 * queueing and comes back is not fetched again. `known` wins where the page already has a better
 * name for somebody, such as "You".
 */
export function useQueueingPlayerNames(players: IQueueingPlayer[], known?: NameOf): NameOf {
    const language = useLanguage();
    const [names, setNames] = useState<Record<number, string>>({});

    const wantedIds = useMemo(
        () =>
            uniq(
                players.flatMap((player) => [
                    player.profileId,
                    ...player.partyProfileIds,
                    ...(player.match?.players ?? []).map((p) => p.profileId),
                ])
            ),
        [players]
    );

    useEffect(() => {
        const missingIds = wantedIds.filter((profileId) => !(profileId in names));
        if (missingIds.length === 0 || !language) return;

        let cancelled = false;

        fetchProfiles({ language, profileIds: missingIds }).then((response) => {
            if (cancelled) return;
            setNames((previous) => ({
                ...previous,
                // Every id that was asked for is recorded, so an id the API has no profile for is
                // not requested again on every event batch.
                ...Object.fromEntries(missingIds.map((profileId) => [profileId, profileId.toString()])),
                ...Object.fromEntries(response.profiles.map((profile) => [profile.profileId, profile.name])),
            }));
        });

        return () => {
            cancelled = true;
        };
    }, [wantedIds, names, language]);

    return (profileId: number) => known?.(profileId) ?? names[profileId];
}
