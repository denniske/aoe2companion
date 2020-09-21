import {Autocomplete} from "@material-ui/lab";
import {fade, Grid, TextField} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import React, {useEffect} from "react";
import gql from "graphql-tag";
import {IUser} from "../helper/types";
import {getFlagIcon} from "../helper/flags";
import {makeStyles} from "@material-ui/core/styles";
import {useRouter} from "next/router";
import Typography from "@material-ui/core/Typography";
import {getCountryName, countriesDistinct, Country} from "@nex/data";


// interface CountryType {
//     name: string;
// }
//
// function sleep(delay = 0) {
//     return new Promise((resolve) => {
//         setTimeout(resolve, delay);
//     });
// }

const countryEarth = null;

export default function CountrySelector() {
    const classes = useStyles();
    const router = useRouter()

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<string | null>(null);
    const [users, setUsers] = React.useState<(string | null)[]>([]);
    const [inputValue, setInputValue] = React.useState('');

    // const [getUsers, {loading, data}] = useLazyQuery<IUsersQuery, any>(UsersQuery);
    // const users = data?.users || [];

    const reallyOpen = open && inputValue?.length > 0;




    const formatCountry = (x: (string | null), inList?: boolean) => {
        if (x == countryEarth) {
            return 'Earth';
        }
        return inList ? getCountryName(x as Country) : x;
    };
    const orderedCountriesDistinct = countriesDistinct.sort((a, b) => formatCountry(a, true).localeCompare(formatCountry(b, true)));
    const countryList: (string | null)[] = [countryEarth, 'DE', ...orderedCountriesDistinct];
    // const divider = (x: any, i: number) => i < 2;
    // const icon = (x: any) => {
    //     if (x == countryEarth) {
    //         return <IconFA name="globe" size={21} style={{paddingLeft: 2, paddingRight: 12}} color={theme.colors.text} />;
    //     }
    //     return <Image fadeDuration={0} style={styles.countryIcon} source={getFlagIcon(x)}/>;
    // };
    // const onCountrySelected = (country: string | null) => {
    //     mutate(setLeaderboardCountry(country));
    // };





    // console.log('users', users);

    useEffect(() => {
        // console.log('inputValue', inputValue);
        if (inputValue == null || inputValue.trim().length == 0) return;
        console.log('searching', inputValue);

        setUsers(countryList);
    }, [inputValue]);

    return (

        <Autocomplete
            id="asynchronous-demo"
            style={{ width: 350 }}
            open={reallyOpen}
            value={value}

            onChange={(event: any, newValue: string | null) => {
                setValue(newValue);
                // router.push('/profile/'+newValue.profile_id);
            }}

            onInputChange={(event, newInputValue) => {
                console.log('onInputChange', event, newInputValue);
                setInputValue(newInputValue);
            }}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            getOptionSelected={(option, value) => option === value}
            getOptionLabel={(option) => option}

            noOptionsText="No player found."

            options={users}
            // loading={loading}

            renderOption={(option) => {
                // console.log('render option', option);

                return (
                    <Grid container>
                        <Grid item>
                            <img src={getFlagIcon(option)} className={classes.flagIcon}/>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="body2"  noWrap>
                            {option}
                            </Typography>
                        </Grid>
                    </Grid>
                );
            }}

            clearOnBlur={false}

            renderInput={(params) => {
                // console.log('params.InputProps', params);
                return (
                    <TextField
                        {...params}
                        // label="Asynchronous"
                        // variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            placeholder: 'Search…',
                            disableUnderline: true,
                            startAdornment: (
                                <SearchIcon/>
                            ),
                            endAdornment: (
                                <React.Fragment>
                                    {/*{loading ? <CircularProgress color="inherit" size={20} /> : null}*/}
                                    {/*{params.InputProps.endAdornment}*/}
                                </React.Fragment>
                            ),
                        }}
                    />
                );
            }}
        />
    );
}

const useStyles = makeStyles((theme) => ({
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
    nameCol: {
    },
    gamesCol: {
        textAlign: 'right',
        color: fade(theme.palette.common.black, 0.60),
    },
}));