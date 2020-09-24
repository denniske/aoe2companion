import React from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {Paper} from "@material-ui/core";
import {useAppStyles} from "../components/app-styles";
import {withApollo} from "../../apollo/client";
import {civs, getCivTeamBonus, iconHeight, iconWidth} from "@nex/data";
import {getCivIconByIndex} from "../helper/civs";
// import Link from "next/link";
import Link, {MyLink} from "../components/link";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    icon: {
        width: iconWidth,
        height: iconHeight,
    },
    name: {},
    civBlock: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 8,
        marginBottom: 8,
        // cursor: 'pointer',
        // backgroundColor: 'yellow',
    },
    civRow: {
        flex: 1,
        marginLeft: 10,
        // backgroundColor: 'blue',
    },
    civList: {
        // backgroundColor: 'red',
    },
    small: {
        fontSize: 12,
        color: '#333',
    },
}));


function Civilization() {
    const appClasses = useAppStyles();
    const classes = useStyles();
    const theme = useTheme();

    return (
        <div>
            <Paper className={appClasses.box}>
                <Typography variant="body1" noWrap>
                    Civilizations
                </Typography>
                <br/>

                {
                    civs.map((civ, i) =>
                        <MyLink key={civ.toString()} href='/civilization/[id]' as={`/civilization/${civ}`} naked>
                            <div className={classes.civBlock}>
                                <img src={getCivIconByIndex(i)} className={classes.icon}/>
                                <div className={classes.civRow}>
                                    <div className={classes.name}>{civ}</div>
                                    <div className={classes.small}>{getCivTeamBonus(civ)}</div>
                                </div>
                            </div>
                        </MyLink>
                    )
                }

            </Paper>
        </div>
    );
}

export default Civilization
// export default withApollo(Civilization, {ssr:true})
