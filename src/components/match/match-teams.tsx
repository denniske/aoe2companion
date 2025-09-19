import React, { Fragment } from 'react';
import { View } from 'react-native';
import { IMatchNew } from '@app/api/helper/api.types';
import { Text } from '@app/components/text';
import { min, sortBy } from 'lodash';
import { useTranslation } from '@app/helper/translate';
import { useAppTheme } from '@app/theming';
import { MatchPlayer } from '@app/components/match/match-player';
import { isMatchFreeForAll } from '@nex/data';
import { Card } from '@app/components/card';

interface Props {
    match: IMatchNew;
}

export default function MatchTeams(props: Props) {
    const { match } = props;
    const getTranslation = useTranslation();
    const theme = useAppTheme();

    const freeForAll = isMatchFreeForAll(match);

    return (
        <Card direction="vertical">
            {sortBy(match.teams, ({ teamId, players }, i) => min(players.map((p) => p.color))).map(({ teamId, players }, i) => (
                <View key={teamId} className="gap-2">
                    {sortBy(players, (p) => p.color).map((player, j) => (
                        <MatchPlayer
                            key={j}
                            // highlight={highlightedUsers?.some((hu) => hu === player.profileId)}
                            match={match}
                            player={player}
                            freeForAll={freeForAll}
                            canDownloadRec={player.replay}
                            // onClose={onClose}
                        />
                    ))}
                    {i < match.teams.length - 1 && (
                        <View className="flex-row items-center gap-4">
                            <View className="bg-gray-200 dark:bg-gray-800 h-[1px] flex-1" />
                            <Text variant="header-sm">{getTranslation('match.versus')}</Text>
                            <View className="bg-gray-200 dark:bg-gray-800 h-[1px] flex-1" />
                        </View>
                    )}
                </View>
            ))}
        </Card>
    );
}
