import React, {useEffect} from 'react';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {fade, Paper, Tabs} from "@material-ui/core";
import {useAppStyles} from "../components/app-styles";
import {AntTab} from "../components/tab/ant-tab";
import {useLazyApi} from '../hooks/use-lazy-api';
import {fetchPlayerMatches} from '../../util/player-matches';
import {fetchLeaderboard} from '@nex/data';
import Grid2 from '../components/grid2';


export default function Ongoing(props) {
    const appClasses = useAppStyles();
    const classes = useStyles();
    const theme = useTheme();

    const [value, setValue] = React.useState(0);
    const [leaderboardId, setLeaderboardId] = React.useState(3);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        const mapping = [3, 4, 1, 2, 0];
        setValue(newValue);
        setLeaderboardId(mapping[newValue]);
    };

    // const matches = useLazyApi(
    //     {},
    //     fetchPlayerMatches, 'aoe2de', 0, 15, [{profile_id: 199325}]
    // );
    //
    // const loadTop100 = async () => {
    //     const args: any = {
    //         start: 1,
    //         count: 1 + 100,
    //     };
    //     const leaderboard = await fetchLeaderboard('aoe2de', leaderboardId, args);
    //     await matches.refetch('aoe2de', 0, 15, leaderboard.leaderboard.map(l => ({profile_id: l.profile_id})));
    // };
    //
    // useEffect(() => {
    //     loadTop100();
    // }, []);
    //
    // console.log('matches', matches.data);

    return (
        <div className={classes.container}>

            <Paper className={appClasses.boxExpanded}>

                <Tabs
                    className={classes.tab}
                    value={value}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleChange}
                    aria-label="disabled tabs example"
                    variant="fullWidth"
                >
                    <AntTab label="RM 1v1" />
                    <AntTab label="RM Team" />
                    <AntTab label="DM 1v1" />
                    <AntTab label="DM Team" />
                    <AntTab label="Unranked" />
                </Tabs>

                <Grid2 leaderboardId={leaderboardId}/>
            </Paper>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    wrapper: {
        position: 'relative',
        flex: 1,
    },
    searchRow: {
        borderRadius: 0,
        display: 'flex',
        alignItems: 'center',
        marginBottom: 0,
        backgroundColor: fade(theme.palette.common.black, 0.00),
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.1), 0px 1px 1px 0px rgba(0,0,0,0.07), 0px 1px 3px 0px rgba(0,0,0,0.06)',
    },
    inputRoot: {
        color: 'inherit',
        flex: 1,
    },
    inputInput: {
        padding: theme.spacing(2, 3, 2, 3),
        display: 'flex',
    },

    tab: {
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.1), 0px 1px 1px 0px rgba(0,0,0,0.07), 0px 1px 3px 0px rgba(0,0,0,0.06)',
        marginBottom: 2,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    selector: {
        margin: theme.spacing(2, 1),
        alignSelf: 'flex-end',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 200,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: 1400,
        maxWidth: '90vw',
    },
}));
