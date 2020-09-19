import React from "react";
import {IMatch, IPlayer} from "../../util/api.types";
import {getMapImage, getMapName} from "../helper/maps";
import {useAppStyles} from "./app-styles";
import {makeStyles} from "@material-ui/core/styles";
import {getString} from "../helper/strings";
import {faCrown, faSkull, faTrophy} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getPlayerBackgroundColor, getSlotTypeName, SlotType} from "../helper/util";
import Link from "next/link";
import ListItem from "@material-ui/core/ListItem";


interface Props {
    player: IPlayer;
}

export default function Player({ player }: Props) {
    const appClasses = useAppStyles();
    const classes = useStyles();
    const boxStyle = {backgroundColor: getPlayerBackgroundColor(player.color)};

    return (
        <Link href='/profile/[id]' as={`/profile/${player.profile_id}`}>
            <div className={classes.rowLink2}>
            <div className={classes.playerWonCol}>
                {
                    player.won === true && player.team != -1 &&
                    <FontAwesomeIcon icon={faCrown} color="goldenrod" />
                }
                {
                    player.won === false && player.team != -1 &&
                    <FontAwesomeIcon icon={faSkull} className={classes.skullIcon} color="grey" />
                }
            </div>

            <div className={classes.squareCol}>
                <div className={classes.square} style={boxStyle}>
                    <span className={classes.squareText}>{player.color}</span>
                </div>
            </div>
            <div className={classes.playerRatingCol}>{player.rating}</div>
            <div className={classes.playerNameCol}>
                {player.slot_type != 1 ? getSlotTypeName(player.slot_type as SlotType) : player.name}
            </div>
            </div>
        </Link>
    )
}

const useStyles = makeStyles((theme) => ({
    skullIcon: {
        marginLeft: 2,
    },
    squareText: {
        color: '#333',
    },
    squareCol: {
        marginLeft: 5,
        width: 20,
    },
    square: {
        flexGrow: 0,
        width: 20,
        height: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #333',
        // backgroundColor: 'red',
        flexDirection: 'row',
    },
    playerWonCol: {
        marginLeft: 5,
        width: 22,
    },
    playerRatingCol: {
        marginLeft: 7,
        width: 38,
        letterSpacing: -0.5,
        // fontVariant: ['tabular-nums'],
    },
    playerNameCol: {
        marginLeft: 5,
        flex: 1,
    },
    playerCol: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5,
        flex: 1,
        paddingVertical: 3,
    },
    row: {
        display: 'flex',
        alignItems: 'center',
    },
    row2: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing(0.5),
        marginBottom: theme.spacing(0.5),
    },
    rowLink2: {
        '&:hover': {
            background: "#EEE",
            // fontWeight: 'bold',
            // textDecoration: 'underline',
        },
        // backgroundColor: 'green',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
    },
    col2: {
        display: 'flex',
        flexDirection: 'column',
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
        width: 60,
        height: 60,
        marginRight: theme.spacing(1),
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

