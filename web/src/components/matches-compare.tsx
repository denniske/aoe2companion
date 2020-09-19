import React from "react";
import {fade, Paper} from "@material-ui/core";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import {useAppStyles} from "./app-styles";
import {makeStyles} from "@material-ui/core/styles";
import {IMatch} from "../../util/api.types";
import {formatDayAndTime, parseUnixTimestamp} from "../helper/util";
import {orderBy} from "lodash";


interface IMatchList {
    total: number;
    matches: IMatch[];
}

interface IMatchesQuery {
    matches: IMatchList;
}

interface Props {
    profileId: string;
}

export default function MatchesCompare(props: any) {
    const appClasses = useAppStyles();
    const classes = useStyles();
    const [leaderboardId, setLeaderboardId] = React.useState('3');

    // const matches = require('../matches');
    // console.log('matches.length', matches.length);

    const leader = 0;

    let merged = [
        // ...ratingsAoe2Net0.map(rating => ({
        //     type: 'rating',
        //     timestamp: rating.timestamp,
        //     rating: rating.rating,
        // })),
        // ...matchesAoe2Net.filter(m => m.leaderboard_id === leader).map(match => ({
        //     type: 'match',
        //     match_id: match.match_id,
        //     timestamp: match.started,
        //     rating: match.players.filter(p => p.profile_id === 251265)[0].rating,
        //     rating_change: match.players.filter(p => p.profile_id === 251265)[0].rating_change,
        //     won: match.players.filter(p => p.profile_id === 251265)[0].won,
        // })),
    ];

    // console.log('matches.length', matchesAoe2Net.filter(m => m.leaderboard_id === leader).length);
    // console.log('matches.rating_change = null', merged.filter(m => m.type == 'match').filter(m => m.rating_change == null).length);
    // console.log('matches.rating = null', merged.filter(m => m.type == 'match').filter(m => m.rating == null).length);
    // console.log('matches.won = null', merged.filter(m => m.type == 'match').filter(m => m.won == null).length);
    // console.log('matches.won = null', merged.filter(m => m.type == 'match').filter(m => m.won == null)[0]);

    merged = orderBy(merged, m => m.timestamp, 'desc');

    return (
        <Paper className={appClasses.box}>

            <div className={classes.row3}>
                <ToggleButtonGroup value={leaderboardId} exclusive onChange={(e, v) => setLeaderboardId(v)} size="small">
                    <ToggleButton value="3">
                        <div className={classes.option}>Random Map 1v1</div>
                    </ToggleButton>
                    <ToggleButton value="4">
                        <div className={classes.option}>Random Map Team</div>
                    </ToggleButton>
                    <ToggleButton value="1">
                        <div className={classes.option}>Death Match 1v1</div>
                    </ToggleButton>
                    <ToggleButton value="2">
                        <div className={classes.option}>Death Match Team</div>
                    </ToggleButton>
                    <ToggleButton value="0">
                        <div className={classes.option}>Unranked</div>
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>

            {
                merged.map(merge => (
                    <>
                    {
                        merge.type === 'rating' &&
                        <div>
                            <p>{formatDayAndTime(parseUnixTimestamp(merge.timestamp))} {merge.rating}</p>
                        </div>
                    }
                    {
                        merge.type === 'match' &&
                        <div>
                            <p>{formatDayAndTime(parseUnixTimestamp(merge.timestamp))} {merge.rating || '???'} Match</p>
                        </div>
                    }
                    </>
                ))
            }

            {/*<div style={{opacity: matchesResult.loading ? 0.7 : 1}}>*/}
            {/*    <div className={classes.row3}>*/}
            {/*        {total} matches*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        {matches?.map(match => <Match key={match.match_id} match={match}/>)}*/}
            {/*    </div>*/}
            {/*</div>*/}
        </Paper>
    );
}

const useStyles = makeStyles((theme) => ({
    col: {
        paddingHorizontal: 7,
        alignItems: 'center',
    },
    h1: {

    },
    h2: {
        fontSize: 11,
    },

    option: {
        padding: theme.spacing(0, 1),
    },
    row3: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
    },
    searchRow: {
        borderRadius: 0,
        display: 'flex',
        alignItems: 'center',
        margin: theme.spacing(0, -3, 2, -3),
        backgroundColor: fade(theme.palette.common.black, 0.00),
    },
    searchIcon: {
        padding: theme.spacing(0, 2, 0, 2),
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        // backgroundColor: 'yellow',
        flex: 1,
    },
    inputInput: {
        padding: theme.spacing(2, 3, 2, 3),
        display: 'flex',
        // flex: 1,
        // backgroundColor: 'pink',
        // paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        // width: '100%',
    },

    containerWrap: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        maxWidth: 800,
    },
    containerWrap50: {
        flex: 1,
    },
    containerWrap50b: {
        flex: 1,
        marginLeft: theme.spacing(3),
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        // flexWrap: 'wrap',
    },
    containerLine: {
        display: 'flex',
        flexDirection: 'column',
    },
    row: {
        display: 'flex',
        alignItems: 'center',
    },
    rowLink2: {
        '&:hover': {
            // background: "#EEE",
            textDecoration: 'underline',
        },
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
    },
    row2: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(1),
    },
    flagIcon: {
        width: 21,
        height: 15,
        marginRight: theme.spacing(1),
    },
    civIcon: {
        width: 28,
        height: 28,
        marginRight: theme.spacing(1),
    },
    mapIcon: {
        width: 28,
        height: 28,
        marginRight: theme.spacing(1),
    },
    tableContainer: {
        maxWidth: 800,
        marginBottom: theme.spacing(3),
        marginRight: theme.spacing(3),
    },
}));
