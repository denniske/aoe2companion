import React from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {Paper} from "@material-ui/core";
import {useAppStyles} from "../components/app-styles";
import {withApollo} from "../../apollo/client";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
}));


function Civilization(props) {
    const appClasses = useAppStyles();
    const classes = useStyles();
    const theme = useTheme();

    return (
        <div>
            <Paper className={appClasses.box}>
                <Typography variant="body1" noWrap>
                    Civilization
                </Typography>
                <Typography variant="subtitle2"  noWrap>
                    RM 1v1
                </Typography>
            </Paper>
        </div>
    );
}

export default withApollo(Civilization, {ssr:false})
