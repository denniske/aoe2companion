import React from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {Paper} from "@material-ui/core";
import {useAppStyles} from "../components/app-styles";
import {withApollo} from "../../apollo/client";
import Grid from "../components/grid";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
}));

// https://joshwcomeau.com/react/the-perils-of-rehydration/
// https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/

function ResponsiveDrawer(props) {
    const appClasses = useAppStyles();
    const classes = useStyles();
    const theme = useTheme();

    return (
        <div>
            <Paper className={appClasses.box}>
                <Typography variant="body1" noWrap>
                    Leaderboard
                </Typography>
                <Typography variant="subtitle2"  noWrap>
                    RM 1v1
                </Typography>
            </Paper>

            <Paper>
                <Grid/>
            </Paper>
        </div>
    );
}

export default withApollo(ResponsiveDrawer, {ssr:false})
