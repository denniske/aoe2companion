import React from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {FormControl, InputLabel, MenuItem, Paper, Select} from "@material-ui/core";
import {useAppStyles} from "../components/app-styles";
import {withApollo} from "../../apollo/client";
import Grid from "../components/grid";
import CountrySelector from "../components/country";

// https://joshwcomeau.com/react/the-perils-of-rehydration/
// https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/

function ResponsiveDrawer(props) {
    const appClasses = useAppStyles();
    const classes = useStyles();
    const theme = useTheme();

    const [age, setAge] = React.useState('');

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setAge(event.target.value as string);
    };

    return (
        <div className={classes.container}>
            {/*<FormControl variant="outlined" size="small" className={classes.formControl}>*/}
            {/*    /!*<InputLabel id="demo-simple-select-label">Age</InputLabel>*!/*/}
            {/*    <Select*/}
            {/*        labelId="demo-simple-select-label"*/}
            {/*        id="demo-simple-select"*/}
            {/*        value={age}*/}
            {/*        onChange={handleChange}*/}
            {/*    >*/}
            {/*        <MenuItem value={10}>Ten</MenuItem>   */}
            {/*        <MenuItem value={30}>Thirty</MenuItem>*/}
            {/*        <MenuItem value={30}>Thirty</MenuItem>*/}
            {/*    </Select>*/}
            {/*</FormControl>*/}

            <CountrySelector />

            <Paper className={appClasses.boxExpanded}>
                <Grid/>
            </Paper>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
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
    },
}));

export default withApollo(ResponsiveDrawer, {ssr:false})
