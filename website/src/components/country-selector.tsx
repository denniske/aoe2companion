import {Autocomplete} from "@material-ui/lab";
import {alpha, Grid, TextField} from "@material-ui/core";
import React from "react";
import {getFlagIcon} from "../helper/flags";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {countriesDistinct, Country, getCountryName} from "@nex/data";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGlobeAmericas} from "@fortawesome/free-solid-svg-icons";


interface ICountry {
    name: string;
    value: Country | null;
}

const countryEarth = null;

const formatCountry = (x: (string | null), inList?: boolean) => {
    if (x == countryEarth) {
        return 'Earth';
    }
    return inList ? getCountryName(x as Country) : x;
};

const orderedCountriesDistinct = countriesDistinct.sort((a, b) => formatCountry(a, true).localeCompare(formatCountry(b, true)));
const countryList: (Country | null)[] = [countryEarth, 'DE', ...orderedCountriesDistinct];

const values = countryList.map(country => ({
    name: formatCountry(country, true),
    value: country,
}));

function CountryIcon(props) {
    const classes = useStyles();
    const { country, inList } = props;
    if (country == countryEarth) {
        return <FontAwesomeIcon icon={faGlobeAmericas} className={inList ? classes.earthIcon : classes.earthIconInList} />
    }
    return <img src={getFlagIcon(country)} className={classes.flagIcon}/>;
}

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

interface Props {
    onChange: (country: Country | null) => void;
}

export default function CountrySelector(props: Props) {
    const classes = useStyles();

    const { onChange } = props;

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<ICountry>(values[0]);
    const [users, setUsers] = React.useState<ICountry[]>([]);
    const [inputValue, setInputValue] = React.useState('');

    return (

        <Autocomplete
            style={{ width: 250 }}
            open={open}
            defaultValue={values[0]}

            // value={value}
            onChange={(event: any, newValue: ICountry) => {
                if (!newValue) return;
                onChange(newValue.value);
            }}

            // onChange={(event: any, newValue: string | null) => {
            //     // setValue(newValue);
            //     console.log('newValue', newValue);
            //     // router.push('/profile/'+newValue.profile_id);
            // }}

            // onInputChange={(event, newInputValue) => {
            //     console.log('onInputChange', event, newInputValue);
            //     setInputValue(newInputValue);
            // }}

            onOpen={() => {
                setOpen(true);
            }}

            onClose={() => {
                setOpen(false);
            }}

            // getOptionSelected={(option, value) => option.value === value.value}

            getOptionLabel={(option) => option.name}

            noOptionsText="No player found."

            options={values}

            renderOption={(option) => {
                // console.log('render option', option);
                return (
                    <Grid container alignItems="center">
                        <Grid item>
                            <CountryIcon country={option.value} inList={true}/>
                            {/*<img src={getFlagIcon(option.value)} className={classes.flagIcon}/>*/}
                        </Grid>
                        <Grid item xs>
                            <Typography variant="body2"  noWrap>
                            {option.name}
                            </Typography>
                        </Grid>
                    </Grid>
                );
            }}

            clearOnBlur={false}
            blurOnSelect={true}
            disableClearable={true}

            renderInput={(params) => {
                const val = (params.inputProps as any).value;
                const country = values.find(v => v.name === val);

                return (
                    <TextField
                        {...params}
                        variant="standard"
                        InputProps={{
                            ...params.InputProps,
                            disableUnderline: true,
                            startAdornment: (
                                <CountryIcon country={country?.value} inList={false}/>
                            ),
                            // endAdornment: (
                            //     <React.Fragment>
                            //         {/*{loading ? <CircularProgress color="inherit" size={20} /> : null}*/}
                            //         {/*{params.InputProps.endAdornment}*/}
                            //     </React.Fragment>
                            // ),
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
    earthIcon: {
        marginRight: theme.spacing(1),
        marginTop: 5,
        // background: 'red',
    },
    earthIconInList: {
        marginRight: theme.spacing(1),
        marginBottom: 1,
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
        color: alpha(theme.palette.common.black, 0.60),
    },
}));
