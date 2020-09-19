import React from 'react';
import {VictoryAxis, VictoryChart, VictoryLine, VictoryScatter, VictoryTheme} from "victory";
import {
    formatDateShort, formatLeaderboardId, formatMonth, formatTime, formatYear, getLeaderboardColor,
    getLeaderboardTextColor,
    parseUnixTimestamp
} from "../helper/util";
import {makeStyles} from "@material-ui/core/styles";
import useDimensions from "../hooks/use-dimensions";
import {IRatingHistory} from "../helper/types";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import {Button, Paper} from "@material-ui/core";
import {isAfter, subDays, subMonths, subWeeks} from "date-fns";

interface IRatingProps {
    ratingHistories: IRatingHistory[];
}

function replaceRobotoWithSystemFont(obj: any) {
    const keys = Object.keys(obj);
    keys.forEach(function(key) {
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

export default function Rating({ratingHistories}: IRatingProps) {
    const classes = useStyles();
    const paperTheme = { dark: false };

    const [ratingHistoryDuration, setRatingHistoryDuration] = React.useState('max');

    const values: string[] = [
        'max',
        '3m',
        '1m',
        '1w',
        '1d',
    ];

    const formatTick = (tick: any, index: number, ticks: any[]) => {
        const date = ticks[index] as Date;
        if (date.getMonth() == 0 && date.getDate() == 1 && date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
            return formatYear(date);
        }
        if (date.getDate() == 1 && date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
            return formatMonth(date);
        }
        if (date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
            return formatDateShort(date);
        }
        return formatTime(ticks[index]);
    };

    const [measureRef, { width }] = useDimensions();
    // console.log('WIDTH', width);
    // const [size, onLayout] = useComponentSize();
    // console.log('size', size);

    let since: any = null;
    switch (ratingHistoryDuration) {
        case '3m':
            since = subMonths(new Date(), 3);
            break;
        case '1m':
            since = subMonths(new Date(), 1);
            break;
        case '1w':
            since = subWeeks(new Date(), 1);
            break;
        case '1d':
            since = subDays(new Date(), 1);
            break;
    }

    ratingHistories = ratingHistories?.map(r => ({
        leaderboard_id: r.leaderboard_id,
        history: r.history.filter(d => d.rating > 0),
    }));

    if (ratingHistories && since != null) {
        ratingHistories = ratingHistories.map(r => ({
            leaderboard_id: r.leaderboard_id,
            history: r.history.filter(d => isAfter(d.timestamp!, since)),
        }));
    }

    return (
            <div className={classes.container}>

                <div className={classes.row3}>
                    <ToggleButtonGroup value={ratingHistoryDuration} exclusive onChange={(e, v) => setRatingHistoryDuration(v)} size="small">
                        {
                            values.map(value => (
                                <ToggleButton key={value} value={value} aria-label="centered" >
                                    <div className={classes.option}>{value}</div>
                                </ToggleButton>
                            ))
                        }
                    </ToggleButtonGroup>
                </div>
                <div ref={measureRef}>
                                <VictoryChart
                                    width={width} height={300}
                                    theme={VictoryTheme.material}
                                    padding={{left: 50, bottom: 30, top: 20, right: 20}}
                                    scale={{ x: "time" }}
                                >
                                    <VictoryAxis crossAxis tickFormat={formatTick} tickCount={width ? Math.round(width/60) : 100} />
                                    {/*<VictoryAxis crossAxis />*/}
                                    <VictoryAxis dependentAxis crossAxis/>
                                    {
                                        ratingHistories?.map(ratingHistory => (
                                            <VictoryLine
                                                name={'line-' + ratingHistory.leaderboard_id}
                                                key={'line-' + ratingHistory.leaderboard_id}
                                                data={ratingHistory.history}
                                                x="timestamp"
                                                y="rating" style={{
                                                data: {stroke: getLeaderboardColor(ratingHistory.leaderboard_id, paperTheme.dark)}
                                            }}
                                            />
                                        ))
                                    }
                                    {
                                        ratingHistories?.map(ratingHistory => (
                                            <VictoryScatter
                                                name={'scatter-' + ratingHistory.leaderboard_id}
                                                key={'scatter-' + ratingHistory.leaderboard_id}
                                                data={ratingHistory.history}
                                                x="timestamp"
                                                y="rating"
                                                size={1.5}
                                                style={{
                                                    data: {fill: getLeaderboardColor(ratingHistory.leaderboard_id, paperTheme.dark)}
                                                }}
                                            />
                                        ))
                                    }
                                </VictoryChart>
                </div>
                <div className={classes.legend}>
                    {
                        (ratingHistories || Array(2).fill(0)).map((ratingHistory, i) => (
                            <span
                                key={'legend-' + i}
                                style={{
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    paddingTop: 5,
                                    paddingBottom: 5,
                                    // fontSize: 12,
                                    color: getLeaderboardTextColor(ratingHistory.leaderboard_id, paperTheme.dark)
                                }}
                            >
                                {formatLeaderboardId(ratingHistory.leaderboard_id)}
                            </span>
                        ))
                    }
                </div>
            </div>
    )
}


const useStyles = makeStyles((theme) => ({
    option: {
        padding: theme.spacing(0, 1),
    },
    row3: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
    },
    chart: {
        backgroundColor: 'yellow',
        width: '100%',
    },
    durationRow: {
        // backgroundColor: 'green',
        flexDirection: 'row',
        justifyContent: 'center',
        // justifyContent: 'flex-end',
        marginBottom: 10,
    },
    container: {
        // backgroundColor: 'green',
        position: "relative"
    },
    legend: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        marginHorizontal: -8,
        marginTop: 10,
        // backgroundColor: 'red',
    },
    legendDesc: {
        textAlign: 'center',
        fontSize: 12
    },
}));
