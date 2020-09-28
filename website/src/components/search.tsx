import {Autocomplete} from "@material-ui/lab";
import {fade, Grid, Paper, TextField} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import React, {useEffect} from "react";
import Toolbar from "@material-ui/core/Toolbar";
import gql from "graphql-tag";
import {IProfile, IUser} from "../helper/types";
import {useLazyQuery, useQuery} from "@apollo/client";
import {getFlagIcon} from "../helper/flags";
import {makeStyles} from "@material-ui/core/styles";
import {useRouter} from "next/router";
import Typography from "@material-ui/core/Typography";


interface CountryType {
    name: string;
}

function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

const UsersQuery = gql`    
    query UsersQuery($search: String!) {
        users(search: $search) {
            profile_id
            name
            country
            games
        }
    }
`

interface IUsersQuery {
    users: IUser[];
}

export default function Search() {
    const classes = useStyles();
    const router = useRouter()

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<IUser | null>(null);
    const [inputValue, setInputValue] = React.useState('');

    const [getUsers, {loading, data}] = useLazyQuery<IUsersQuery, any>(UsersQuery);

    const users = data?.users || [];

    const reallyOpen = open && inputValue?.length > 0;

    // console.log('users', users);

    useEffect(() => {
        // console.log('inputValue', inputValue);
        if (inputValue == null || inputValue.trim().length == 0) return;
        console.log('searching', inputValue);

        getUsers({
            variables: { search: inputValue },
        });
    }, [inputValue]);

    return (

        <Autocomplete
            style={{ width: 350 }}
            open={reallyOpen}
            value={value}
            inputValue={inputValue}

            onChange={(event: any, newValue: IUser | null) => {
                router.push('/profile/[id]', `/profile/${newValue.profile_id}`);
                setInputValue('');
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
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}

            noOptionsText="No player found."

            options={users}
            loading={loading}

            renderOption={(option) => {
                // console.log('render option', option);

                return (
                    <Grid container>
                        <Grid item>
                            <img src={getFlagIcon(option.country)} className={classes.flagIcon}/>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="body2"  noWrap>
                            {option.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} className={classes.gamesCol}>
                            <Typography variant="body2">
                            {option.games} games
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
        color: theme.palette.text.secondary,
    },
}));
