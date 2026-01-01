import React from 'react';
import { formatCustom, formatDate, LeaderboardId } from '@nex/data';
import { getLeaderboardColor } from '../../helper/colors';
import { useAppTheme } from '../../theming';
import { isAfter, subYears } from 'date-fns';
import { LineSegment, VictoryAxis, VictoryChart, VictoryCursorContainer, VictoryLabel, VictoryLine, VictoryScatter, VictoryTheme } from 'victory';
import { IProfileRatingsLeaderboard } from '../../api/helper/api.types';
import { cloneDeep, merge, orderBy } from 'lodash';
import { getRatingTimespan } from '@app/utils/rating';
import { useCSSVariable, useResolveClassNames, useUniwind } from 'uniwind';
import _ from 'lodash';

interface IRatingChartProps {
    formatTick: (date: Date) => string;
    ratingHistoryDuration?: string;
    filteredRatingHistories: Array<IProfileRatingsLeaderboard & { label?: string; color?: string }> | null | undefined;
    hiddenLeaderboardIds: LeaderboardId[];
    width: number;
    allowMouseInteraction?: boolean;
}

export default function RatingChart(props: IRatingChartProps) {
    const { formatTick, ratingHistoryDuration, filteredRatingHistories, hiddenLeaderboardIds, width, allowMouseInteraction } = props;

    const appTheme = useAppTheme();
    const { theme } = useUniwind();

    const since = getRatingTimespan(ratingHistoryDuration);
    let firstDate = since ?? filteredRatingHistories?.[0]?.ratings?.[0]?.date ?? subYears(new Date(), 1);

    const newVictoryTheme = useNewVictoryTheme();

    const styles = useResolveClassNames('stroke-black dark:stroke-white');

    return (
        <VictoryChart
            width={width}
            height={400}
            domainPadding={{ y: 10 }}
            theme={theme === 'dark' ? newVictoryTheme.customDark : newVictoryTheme.custom}
            padding={{ left: 50, bottom: 30, top: 20, right: 20 }}
            scale={{ x: 'time' }}
            containerComponent={
                allowMouseInteraction ? (
                    <VictoryCursorContainer
                        cursorComponent={<LineSegment style={styles} />}
                        cursorDimension="x"
                        cursorLabel={({ datum }) => {
                            const ratings = filteredRatingHistories?.map((history) =>
                                orderBy(history.ratings, 'date', 'desc').find((r) => !isAfter(r.date, datum.x))
                            );

                            const labels = [
                                `${formatCustom(datum.x, 'P')}`,
                                ...(ratings?.map((r, index) =>
                                    r?.rating
                                        ? `${filteredRatingHistories?.[index]?.label} - ${r?.rating}`
                                        : `${filteredRatingHistories?.[index]?.label} = No rating`
                                ) ?? []),
                            ];
                            return labels as unknown as number;
                        }}
                        cursorLabelComponent={
                            <VictoryLabel
                                backgroundStyle={filteredRatingHistories ? [{
                                    fill: 'black',
                                    borderRadius: 100,
                                    strokeWidth: 1,
                                    stroke: 'white',
                                }, ...filteredRatingHistories?.map((h) => ({
                                    fill: h.color,
                                    borderRadius: 100,
                                    strokeWidth: 1,
                                    stroke: 'white',
                                }))] : undefined}
                                backgroundPadding={{ top: 5, bottom: 5, right: 8, left: 8 }}
                                style={{ fill: 'white' }}
                            />
                        }
                    />
                ) : undefined
            }
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
                            data: {
                                stroke: ratingHistory.color ?? getLeaderboardColor(ratingHistory.leaderboardId, appTheme.dark),
                            },
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
                            data: { fill: ratingHistory.color ?? getLeaderboardColor(ratingHistory.leaderboardId, appTheme.dark) },
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
