import React from 'react';
import { LeaderboardId } from '@nex/data';
import { getLeaderboardColor } from '../../helper/colors';
import { useAppTheme } from '../../theming';
import { subYears } from 'date-fns';
import { VictoryAxis, VictoryChart, VictoryLine, VictoryScatter, VictoryTheme } from 'victory-native';
import { IProfileRatingsLeaderboard } from '../../api/helper/api.types';
import { cloneDeep, merge } from 'lodash';
import { getRatingTimespan } from '@app/utils/rating';
import { useCSSVariable, useUniwind } from 'uniwind';
import { Dimensions } from 'react-native';

interface IRatingChartProps {
    formatTick: (date: Date) => string;
    ratingHistoryDuration: string;
    filteredRatingHistories: IProfileRatingsLeaderboard[] | null | undefined;
    hiddenLeaderboardIds: LeaderboardId[];
    width: number
}

export default function RatingChart(props: IRatingChartProps) {
    const {
        formatTick,
        ratingHistoryDuration,
        filteredRatingHistories,
        hiddenLeaderboardIds,
        width
    } = props;

    const appTheme = useAppTheme();
    const { theme } = useUniwind();

    const since = getRatingTimespan(ratingHistoryDuration);
    let firstDate = since ?? filteredRatingHistories?.[0]?.ratings?.[0]?.date ?? subYears(new Date(), 1);

    const newVictoryTheme = useNewVictoryTheme();

    return (
        <VictoryChart
            width={width}
            height={300}
            theme={theme === 'dark' ? newVictoryTheme.customDark : newVictoryTheme.custom}
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
                            data: { stroke: getLeaderboardColor(ratingHistory.leaderboardId, appTheme.dark) },
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
                            data: { fill: getLeaderboardColor(ratingHistory.leaderboardId, appTheme.dark) },
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

let _themeWithSystemFont = replaceRobotoWithSystemFont(cloneDeep(VictoryTheme.material));
let _themeWithSystemFontDark = replaceRobotoWithSystemFont(cloneDeep(VictoryTheme.material));

function useNewVictoryTheme() {
    const colorBlack = useCSSVariable('--color-black') as string;
    const colorWhite = useCSSVariable('--color-white') as string;

    const themeWithSystemFont = merge(_themeWithSystemFont, {
        axis: {
            style: {
                tickLabels: {
                    fill: colorBlack,
                },
            },
        },
        line: {
            style: {
                labels: {
                    fill: colorBlack,
                },
            },
        },
    });

    const themeWithSystemFontDark = merge(_themeWithSystemFontDark, {
        axis: {
            style: {
                tickLabels: {
                    fill: colorWhite,
                },
            },
        },
        line: {
            style: {
                labels: {
                    fill: colorWhite,
                },
            },
        },
    });

    return { ...VictoryTheme, custom: themeWithSystemFont, customDark: themeWithSystemFontDark };
}
