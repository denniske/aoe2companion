import React from 'react';
import { LeaderboardId } from '@nex/data';
import { getLeaderboardColor } from '../../helper/colors';
import { useAppTheme } from '../../theming';
import { subYears } from 'date-fns';
import { VictoryAxis, VictoryChart, VictoryLine, VictoryScatter, VictoryTheme } from 'victory-native';
import { IProfileRatingsLeaderboard } from '../../api/helper/api.types';
import { windowWidth } from '@app/app/statistics/leaderboard';
import { useColorScheme } from 'nativewind';
import { cloneDeep, merge } from 'lodash';
import tw from '@app/tailwind';
import { getRatingTimespan } from '@app/utils/rating';

interface IRatingChartProps {
    formatTick: (date: Date) => string;
    ratingHistoryDuration: string;
    filteredRatingHistories: IProfileRatingsLeaderboard[] | null | undefined;
    hiddenLeaderboardIds: LeaderboardId[];
}

export default function RatingChart(props: IRatingChartProps) {
    const {
        formatTick,
        ratingHistoryDuration,
        filteredRatingHistories,
        hiddenLeaderboardIds,
    } = props;

    const theme = useAppTheme();
    const { colorScheme } = useColorScheme();

    const since = getRatingTimespan(ratingHistoryDuration);
    let firstDate = since ?? filteredRatingHistories?.[0]?.ratings?.[0]?.date ?? subYears(new Date(), 1);

    return (
        <VictoryChart
            width={windowWidth - 40}
            height={300}
            theme={colorScheme === 'dark' ? NewVictoryTheme.customDark : NewVictoryTheme.custom}
            padding={{ left: 50, bottom: 30, top: 20, right: 20 }}
            scale={{ x: 'time' }}
            // containerComponent={
            //     <VictoryZoomContainer key={'zoom'}/>
            // }
        >
            <VictoryAxis crossAxis tickFormat={formatTick} fixLabelOverlap={true} scale={'time'} domain={[firstDate, new Date()] as any} />
            <VictoryAxis dependentAxis crossAxis />
            {filteredRatingHistories
                ?.filter((rh) => !hiddenLeaderboardIds?.includes(rh.leaderboardId))
                .map((ratingHistory) => (
                    <VictoryLine
                        name={'line-' + ratingHistory.leaderboardId}
                        key={'line-' + ratingHistory.leaderboardId}
                        data={ratingHistory.ratings}
                        x="date"
                        y="rating"
                        style={{
                            data: { stroke: getLeaderboardColor(ratingHistory.leaderboardId, theme.dark) },
                        }}
                    />
                ))}
            {filteredRatingHistories
                ?.filter((rh) => !hiddenLeaderboardIds?.includes(rh.leaderboardId))
                .map((ratingHistory) => (
                    <VictoryScatter
                        name={'scatter-' + ratingHistory.leaderboardId}
                        key={'scatter-' + ratingHistory.leaderboardId}
                        data={ratingHistory.ratings}
                        x="date"
                        y="rating"
                        size={1.5}
                        style={{
                            data: { fill: getLeaderboardColor(ratingHistory.leaderboardId, theme.dark) },
                        }}
                    />
                ))}
        </VictoryChart>
    );
}


function replaceRobotoWithSystemFont(obj: any) {
    const keys = Object.keys(obj);
    keys.forEach(function (key) {
        const value = obj[key];
        if (key === 'fontFamily') {
            obj[key] = obj[key].replace("'Roboto',", "'System',");
        }
        if (typeof value === 'object') {
            replaceRobotoWithSystemFont(obj[key]);
        }
    });
    return obj;
}

let themeWithSystemFont = replaceRobotoWithSystemFont(cloneDeep(VictoryTheme.material));

themeWithSystemFont = merge(themeWithSystemFont, {
    axis: {
        style: {
            tickLabels: {
                fill: tw.color('text-black'),
            },
        },
    },
    line: {
        style: {
            labels: {
                fill: tw.color('text-black'),
            },
        },
    },
});

let themeWithSystemFontDark = replaceRobotoWithSystemFont(cloneDeep(VictoryTheme.material));

themeWithSystemFontDark = merge(themeWithSystemFontDark, {
    axis: {
        style: {
            tickLabels: {
                fill: tw.color('text-white'),
            },
        },
    },
    line: {
        style: {
            labels: {
                fill: tw.color('text-white'),
            },
        },
    },
});

const NewVictoryTheme = { ...VictoryTheme, custom: themeWithSystemFont, customDark: themeWithSystemFontDark };
