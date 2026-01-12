import React, { Fragment, useMemo } from 'react';
import { View } from 'react-native';
import { IMatchNew } from '@app/api/helper/api.types';
import { Text } from '@app/components/text';
import { chunk } from 'lodash';
import { useTranslation } from '@app/helper/translate';
import { MatchPlayer } from '@app/components/match/match-player';
import { isMatchFreeForAll } from '@nex/data';
import { Card } from '@app/components/card';
import cn from 'classnames';
import { appConfig } from '@nex/dataset';
import { useBreakpoints } from '@app/hooks/use-breakpoints';
import { sortTeamsByCurrentPlayer, sortTeamByCurrentPlayer, getProfileIdFromHighlightedUsers } from '../../utils/match';

interface Props {
    match: IMatchNew;
    wrap?: boolean;
    canDownloadRecs?: boolean;
    highlightedUsers?: number[];
}

export default function MatchTeams({ match, wrap = true, canDownloadRecs, highlightedUsers }: Props) {
    const getTranslation = useTranslation();
    const { isMedium } = useBreakpoints();

    const freeForAll = isMatchFreeForAll(match);
    const Component = wrap ? Card : View;

    const user = getProfileIdFromHighlightedUsers(match, highlightedUsers);

    const allTeams = sortTeamsByCurrentPlayer(match.teams, user);
    const teamChunks = chunk(allTeams, 2);

    return (
        <Component direction="vertical" className="gap-2">
            {teamChunks.map((teams, chunkIndex) => (
                <>
                    <View className="md:flex-row gap-2">
                        {teams.map(({ teamId, players }, teamIndex) => (
                            <Fragment key={teamId}>
                                <View className="gap-2 md:flex-1">
                                    {sortTeamByCurrentPlayer(players, user).map((player, playerIndex) => (
                                        <MatchPlayer
                                            key={playerIndex}
                                            highlight={highlightedUsers?.includes(player.profileId)}
                                            match={match}
                                            player={player}
                                            freeForAll={freeForAll}
                                            canDownloadRec={canDownloadRecs}
                                            className={cn('border-border rounded border overflow-hidden', appConfig.game === 'aoe2' && 'border-2')}
                                            reverse={isMedium && teamIndex === 1}
                                        />
                                    ))}
                                </View>
                                {teamIndex < teams.length - 1 && (
                                    <View className="flex-row items-center gap-4">
                                        <View className="bg-gray-200 dark:bg-gray-800 h-px flex-1" />
                                        <Text variant="header-sm">{getTranslation('match.versus')}</Text>
                                        <View className="bg-gray-200 dark:bg-gray-800 h-px flex-1" />
                                    </View>
                                )}
                            </Fragment>
                        ))}
                    </View>
                    {chunkIndex < teamChunks.length - 1 && (
                        <View className="flex-row items-center gap-4">
                            <View className="bg-gray-200 dark:bg-gray-800 h-px flex-1" />
                            <Text variant="header-sm">{getTranslation('match.versus')}</Text>
                            <View className="bg-gray-200 dark:bg-gray-800 h-px flex-1" />
                            <View className="bg-gray-200 dark:bg-gray-800 w-px self-stretch hidden md:flex" />
                            <View className="bg-gray-200 dark:bg-gray-800 h-px flex-1 hidden md:flex" />
                            <Text variant="header-sm" className="hidden md:flex">
                                {getTranslation('match.versus')}
                            </Text>
                            <View className="bg-gray-200 dark:bg-gray-800 h-px flex-1 hidden md:flex" />
                        </View>
                    )}
                </>
            ))}
        </Component>
    );
}
