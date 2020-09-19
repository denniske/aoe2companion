import React from "react";
import {IMatch} from "../../util/api.types";
import {getMapImage, getMapName} from "../helper/maps";
import {useAppStyles} from "./app-styles";
import {makeStyles} from "@material-ui/core/styles";
import {getString} from "../helper/strings";
import Player from "./player";
import { groupBy } from "lodash";
import {differenceInSeconds} from "date-fns";
import {formatAgo} from "../helper/util";
import {Typography} from "@material-ui/core";


interface Props {
    match: IMatch;
}

const formatDuration = (start: Date, finish: Date) => {
    const diffTime = differenceInSeconds(finish, start);
    if (!diffTime) return '00:00'; // divide by 0 protection
    const minutes = Math.abs(Math.floor(diffTime / 60) % 60).toString();
    const hours = Math.abs(Math.floor(diffTime / 60 / 60)).toString();
    return `${hours.length < 2 ? 0 + hours : hours}:${minutes.length < 2 ? 0 + minutes : minutes} min`;
};

export default function Match({ match }: Props) {
    const appClasses = useAppStyles();
    const classes = useStyles();

    let duration: string = '';
    if (match.started) {
        const finished = match.finished || new Date();
        duration = formatDuration(match.started, finished);
    }
    const teams = Object.entries(groupBy(match.players, p => p.team));
    return (
        <div className={classes.col2}>
            <div className={classes.row2b}>
                {getMapName(match.map_type)}
                {/*({getString('leaderboard', match.leaderboard_id)})*/}
            </div>
            {/*<div className={classes.row2b}>*/}
            {/*    {getMapName(match.map_type)}*/}
            {/*</div>*/}
            {/*<div className={classes.row2b} style={{fontSize: 12}}>*/}
            {/*    {getString('leaderboard', match.leaderboard_id)}*/}
            {/*</div>*/}
            <div className={classes.row2}>
                {
                    !match.finished &&
                    <div>{duration}</div>
                }
                {
                    match.finished &&
                    <Typography variant="caption">{match.started ? formatAgo(match.started) : 'none'}</Typography>
                }
            </div>
            <div className={classes.row2}>
                <img src={getMapImage(match.map_type)} className={classes.mapIcon} />
                <div className={classes.expRow}>
                    {
                        teams.map(([team, players], i) =>
                            <div key={team} className={classes.expRow}>
                                <div className={classes.teamCol}>
                                    {
                                        players.map((player, j) => <Player key={j} player={player}/>)
                                    }
                                </div>
                                {
                                    i < teams.length-1 &&
                                    <div className={classes.row}>
                                        <div className={classes.versus}>
                                            <div className={classes.versusText}>VS</div>
                                        </div>
                                        <div className={classes.versus2}/>
                                    </div>
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    versus: {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
    },
    versusText: {
    },
    versus2: {
    },
    row: {
        display: 'flex',
        alignItems: 'center',
    },
    row2: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing(1),
    },
    row2b: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        // marginBottom: theme.spacing(0.5),
    },
    col2: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: theme.spacing(1),
    },
    teamCol: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    expRow: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
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
        width: 80,
        height: 80,
        marginRight: theme.spacing(2),
    },
    tableContainer: {
        marginBottom: theme.spacing(3),
        // display: 'flex',
    },
    table: {
        // marginBottom: theme.spacing(3),
        // display: 'flex',
    },
}));

