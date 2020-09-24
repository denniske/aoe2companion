import React from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {Paper} from "@material-ui/core";
import {Civ, civs, iconHeight, iconWidth, parseCivDescription} from "@nex/data";
import {useRouter} from "next/router";
import {useAppStyles} from "../../components/app-styles";
import {withApollo} from "../../../apollo/client";

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
    heading: {
        marginVertical: 10,
        lineHeight: '24px',
        fontWeight: 'bold',
    },

    box: {
        // borderTopWidth: 1,
        // borderTopColor: '#DDD',
        // borderBottomWidth: 1,
        // borderBottomColor: '#CCC',
        // marginTop: 10,
        // marginHorizontal: -20,
        // paddingHorizontal: 20,
    },
    bonusRow: {
        // marginLeft: 40,
        display: 'flex',
        flexDirection: 'row',
    },
    content: {
        // marginBottom: 5,
        textAlign: 'left',
        lineHeight: '24px',
        // fontSize: 17,
    },

}));


function Civilization({id}: any) {
    const appClasses = useAppStyles();
    const classes = useStyles();
    const theme = useTheme();
    // const civ = useRouter().query.id as Civ;
    const civ = id as Civ;

    const civDescription = parseCivDescription(civ);

    const {type, boni, uniqueUnitsTitle, uniqueTechsTitle, teamBonusTitle, teamBonus} = civDescription;
    
    return (
        <div>
            <Paper className={appClasses.box}>
                <Typography variant="body1" noWrap>
                    {civ}
                </Typography>
                <Typography variant="subtitle2" noWrap>
                    {type}
                </Typography>
                <br/>

                <div className={classes.box}>
                    <div className={classes.heading}>Bonus</div>
                    {
                        boni.map((bonus, i) =>
                            <div key={i} className={classes.bonusRow}>
                                <div className={classes.content}>•&nbsp;</div>
                                <div className={classes.content}>{bonus}</div>
                            </div>
                        )
                    }
                </div>

            </Paper>
        </div>
    );
}

export async function getStaticPaths() {
    // Get the paths we want to pre-render based on posts
    const paths = civs.map((post) => `/civilization/${post}`)

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
    // params contains the post `id`.
    // If the route is like /posts/1, then params.id is 1
    // const res = await fetch(`https://.../posts/${params.id}`)
    // const post = await res.json()

    // Pass post data to the page via props
    return { props: { id: params.id } }
}


export default Civilization
// export default withApollo(Civilization, {ssr:true})
