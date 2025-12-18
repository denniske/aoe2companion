import React, { Fragment } from 'react';
import { View } from 'react-native';
import { IMatchNew } from '@app/api/helper/api.types';
import { Text } from '@app/components/text';
import { chunk, min, sortBy } from 'lodash';
import { useTranslation } from '@app/helper/translate';
import { useAppTheme } from '@app/theming';
import { MatchPlayer } from '@app/components/match/match-player';
import { isMatchFreeForAll } from '@nex/data';
import { Card } from '@app/components/card';
import cn from 'classnames';
import { appConfig } from '@nex/dataset';

interface Props {
    match: IMatchNew;
    wrap?: boolean;
}

export default function MatchTeams(props: Props) {
    const { match, wrap = true } = props;
    const getTranslation = useTranslation();
    const theme = useAppTheme();

    const freeForAll = isMatchFreeForAll(match);
    const Component = wrap ? Card : View;

    const allTeams = sortBy(match.teams, ({ players }) => min(players.map((p) => p.color)));
    const teamChunks = chunk(allTeams, 2);

    return (
        <Component direction="vertical" className="gap-2">
            {teamChunks.map((teams, chunkIndex) => (
                <>
                    <View className="md:flex-row gap-2">
                        {teams.map(({ teamId, players }, teamIndex) => (
                            <Fragment key={teamId}>
                                <View className="gap-2 md:flex-1">
                                    {sortBy(players, (p) => p.color).map((player, playerIndex) => (
                                        <MatchPlayer
                                            key={playerIndex}
                                            // highlight={highlightedUsers?.some((hu) => hu === player.profileId)}
                                            match={match}
                                            player={player}
                                            freeForAll={freeForAll}
                                            canDownloadRec={player.replay}
                                            className={cn(
                                                'border-border rounded pr-4 border overflow-hidden',
                                                appConfig.game === 'aoe2' && 'border-2',
                                                teamIndex === 1 && 'md:flex-row-reverse md:pl-4 md:pr-0'
                                            )}
                                            colorClassName={cn('w-8 h-8 pr-0.5', teamIndex === 1 && 'md:pl-0.5 md:pr-0')}
                                            // onClose={onClose}
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
