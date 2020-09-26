import React from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {Paper} from "@material-ui/core";
import {useAppStyles} from "../components/app-styles";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
}));

// https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/

export default function ResponsiveDrawer(props) {
    const appClasses = useAppStyles();
    const classes = useStyles();
    const theme = useTheme();

    return (
        <div>
            <Paper className={appClasses.box}>
                <Typography variant="body1" noWrap>
                    About
                </Typography>
            </Paper>
        </div>
    );
}
