import {alpha, InputBase, Paper} from "@material-ui/core";
import React, {useState} from "react";
import {createStylesheet} from "../helper/styles";
import {iconHeight, iconWidth} from "@nex/data";

interface Props {
    search: string;
    onChangeSearch: (search: string) => void;
}

export default function SearchBar(props: Props) {
    const { search, onChangeSearch } = props;
    const classes = useStyles();

    return (
        <div className={classes.searchRow}>
            <InputBase
                value={search}
                onChange={(e) => onChangeSearch(e.target.value)}
                placeholder="Search by name…"
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                }}
                inputProps={{'aria-label': 'search'}}
            />
        </div>
    );
}

const useStyles = createStylesheet((theme) => ({
    searchRow: {
        borderRadius: 0,
        display: 'flex',
        alignItems: 'center',
        // margin: theme.spacing(0, -3, 2, -3),
        // marginTop: -theme.spacing(3),
        marginBottom: 0,
        backgroundColor: alpha(theme.palette.common.black, 0.00),
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
}));

// {/*<div className={classes.searchIcon}>*/}
// {/*  <SearchIcon/>*/}
// {/*</div>*/}
// {/*<Searchbar*/}
// {/*    className={classes.searchbar}*/}
// {/*    placeholder="building"*/}
// {/*    onChangeText={text => setText(text)}*/}
// {/*    value={text}*/}
// {/*/>*/}
