import React from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {fade, FormControl, InputBase, InputLabel, MenuItem, Paper, Select, Tabs, TextField} from "@material-ui/core";
import {useAppStyles} from "../components/app-styles";
import {withApollo} from "../../apollo/client";
import Grid from "../components/grid";
import CountrySelector from "../components/country-selector";
import {Autocomplete} from "@material-ui/lab";
import Match from "../components/match";
import {AntTab} from "../components/tab/ant-tab";
import {Country} from "@nex/data";

// https://joshwcomeau.com/react/the-perils-of-rehydration/
// https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/

function ResponsiveDrawer(props) {
    const appClasses = useAppStyles();
    const classes = useStyles();
    const theme = useTheme();

    // const [age, setAge] = React.useState('');
    //
    // const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    //     setAge(event.target.value as string);
    // };

    const [value, setValue] = React.useState(0);
    const [leaderboardId, setLeaderboardId] = React.useState(3);
    const [country, setCountry] = React.useState<Country | null>();

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        const mapping = [3, 4, 1, 2, 0];
        setValue(newValue);
        setLeaderboardId(mapping[newValue]);
    };

    const handleCountryChange = (country: Country | null) => {
        setCountry(country);
    };

    const [search, setSearch] = React.useState('');

    return (
        <div className={classes.container}>

            <div className={classes.row}>
                <div className={classes.selector}>
                    <CountrySelector onChange={handleCountryChange} />
                </div>
            </div>

            <Paper className={appClasses.boxExpanded}>

                <div className={classes.searchRow}>
                    <InputBase
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name…"
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
                    <AntTab label="RM 1v1" />
                    <AntTab label="RM Team" />
                    <AntTab label="DM 1v1" />
                    <AntTab label="DM Team" />
                    <AntTab label="Unranked" />
                </Tabs>

                <Grid leaderboardId={leaderboardId} country={country} search={search}/>
            </Paper>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
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
    },
}));

export default withApollo(ResponsiveDrawer, {ssr:false})













// {/*<FormControl variant="outlined" size="small" className={classes.formControl}>*/}
// {/*    /!*<InputLabel id="demo-simple-select-label">Age</InputLabel>*!/*/}
// {/*    <Select*/}
// {/*        labelId="demo-simple-select-label"*/}
// {/*        id="demo-simple-select"*/}
// {/*        value={age}*/}
// {/*        onChange={handleChange}*/}
// {/*    >*/}
// {/*        <MenuItem value={10}>Ten</MenuItem>   */}
// {/*        <MenuItem value={30}>Thirty</MenuItem>*/}
// {/*        <MenuItem value={30}>Thirty</MenuItem>*/}
// {/*    </Select>*/}
// {/*</FormControl>*/}
//
// {/*<Autocomplete*/}
// {/*    id="combo-box-demo"*/}
// {/*    options={top100Films}*/}
// {/*    getOptionLabel={(option) => option.title}*/}
// {/*    style={{ width: 300 }}*/}
// {/*    renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}*/}
// {/*/>*/}