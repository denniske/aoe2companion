import {useQuery} from "@apollo/client";
import React from "react";
import {createStyles, fade, InputBase, Paper, Tab, Tabs, Theme, useTheme, withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Match from "./match";
import {useAppStyles} from "./app-styles";
import {makeStyles} from "@material-ui/core/styles";
import gql from "graphql-tag";
import {IMatch} from "../../util/api.types";
import {maps} from "../helper/maps";
import SwipeableViews from 'react-swipeable-views';


const MatchesQuery = gql`
    query MatchesQuery($profileId: Int!, $leaderboardId: Int, $search: String) {
        matches(
            start: 0,
            count: 5,
            profile_id: $profileId,
            leaderboard_id: $leaderboardId
            search: $search
        ) {
            total
            matches {
                match_id
                leaderboard_id
                name
                map_type
                started
                finished
                players {
                    profile_id
                    name
                    rating
                    civ
                    slot
                    slot_type
                    color
                    won
                    team
                }
            }
        }
    }
`

const MatchQuery = gql`
    query MatchQuery($match_id: Int, $match_uuid: String) {
        match(
            match_id: $match_id,
            match_uuid: $match_uuid
        ) {
            match_id
            leaderboard_id
            name
            map_type
            started
            finished
            players {
                profile_id
                name
                rating
                civ
                slot
                slot_type
                color
                won
                team
            }
        }
    }
`

interface IMatchList {
    total: number;
    matches: IMatch[];
}

interface IMatchesQuery {
    matches: IMatchList;
}

interface Props {
    profileId: number;
}

const AntTab = withStyles((theme: Theme) =>
    createStyles({
        root: {
            minWidth: 100,
        },
    }),
)((props: any) => <Tab {...props} />);

export default function ProfileMatches({profileId}: Props) {
    const appClasses = useAppStyles();
    const classes = useStyles();
    const theme = useTheme();

    const [text, setText] = React.useState('');
    const [leaderboardId, setLeaderboardId] = React.useState<number>();

    const matchesResult = useQuery<IMatchesQuery, any>(MatchesQuery, {
        variables: {
            profileId: profileId,
            leaderboardId: leaderboardId,
            search: text,
            map_types: Object.entries(maps).filter(([map_type, name]) => name.toLowerCase().indexOf(text.toLowerCase()) >= 0).map(([map_type, name]) => map_type),
        },
        skip: profileId == null,
        fetchPolicy: 'network-only',
    })

    const total = matchesResult.data?.matches.total;
    const matches = matchesResult.data?.matches.matches;

    // console.log('total', total);
    // console.log('matches', matches);

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        const mapping = [null, 3, 4, 1, 2, 0];
        setValue(newValue);
        setLeaderboardId(mapping[newValue]);
    };
    const handleChangeIndex = (index: number) => {
        const mapping = [null, 3, 4, 1, 2, 0];
        setValue(index);
        setLeaderboardId(mapping[index]);
    };

    return (
        <Paper className={appClasses.boxForTable}>
            <div className={classes.searchRow}>
                {/*<div className={classes.searchIcon}>*/}
                {/*  <SearchIcon/>*/}
                {/*</div>*/}
                <InputBase
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Search by name, map, player…"
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{'aria-label': 'search'}}
                />
            </div>

            <Tabs
                className={classes.tab}
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
                aria-label="disabled tabs example"
                variant="fullWidth"
            >
                <AntTab label="All" />
                <AntTab label="RM 1v1" />
                <AntTab label="RM Team" />
                <AntTab label="DM 1v1" />
                <AntTab label="DM Team" />
                <AntTab label="Unranked" />
            </Tabs>

            {/*<SwipeableViews index={value} onChangeIndex={handleChangeIndex} className={classes.maxHeight}>*/}
            <div className={classes.maxHeight}>
                <div style={{opacity: matchesResult.loading ? 0.7 : 1}} className={classes.maxHeightInner}>
                    <div className={classes.rowInfo}>
                        {total} matches
                    </div>
                    <div>
                        {matches?.map(match => <Match key={match.match_id} match={match} profileId={profileId}/>)}
                    </div>
                </div>
            </div>
                {/*<div style={{opacity: matchesResult.loading ? 0.7 : 1}} className={classes.maxHeightInner}>*/}
                {/*    <div className={classes.rowInfo}>*/}
                {/*        {total} matches*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        {matches?.map(match => <Match key={match.match_id} match={match} profileId={profileId}/>)}*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div style={{opacity: matchesResult.loading ? 0.7 : 1}} className={classes.maxHeightInner}>*/}
                {/*    <div className={classes.rowInfo}>*/}
                {/*        {total} matches*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        {matches?.map(match => <Match key={match.match_id} match={match} profileId={profileId}/>)}*/}
                {/*    </div>*/}
                {/*</div>*/}
            {/*</SwipeableViews>*/}
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

    maxHeight: {
        height: 700,
        overflow: 'auto',
    },
    maxHeightInner: {
        padding: theme.spacing(3),
    },

    rowInfo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing(2),
    },

    tab: {
        // marginTop: -theme.spacing(3),
        // marginLeft: -theme.spacing(3),
        // marginRight: -theme.spacing(3),
        // marginBottom: theme.spacing(2),
        // borderBottom: '1px solid #333',
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.1), 0px 1px 1px 0px rgba(0,0,0,0.07), 0px 1px 3px 0px rgba(0,0,0,0.06)',
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
        // margin: theme.spacing(0, -3, 2, -3),
        // marginTop: -theme.spacing(3),
        marginBottom: 0,
        backgroundColor: fade(theme.palette.common.black, 0.00),
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.1), 0px 1px 1px 0px rgba(0,0,0,0.07), 0px 1px 3px 0px rgba(0,0,0,0.06)',
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
