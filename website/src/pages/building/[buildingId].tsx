import React from 'react';
import Typography from '@material-ui/core/Typography';
import {useTheme} from '@material-ui/core/styles';
import {Paper} from "@material-ui/core";
import {
    Building, buildingList,
    Civ, civs, getBuildingData, getBuildingDescription, iconHeight, iconWidth, keysOf, Other, parseCivDescription,
    sortResources
} from "@nex/data";
import {useAppStyles} from "../../components/app-styles";
import {createStylesheet} from "../../helper/styles";
import {getOtherIcon} from "../../helper/other";
import Space from "../../components/space";
import CivAvailability from "../../components/civ-availability";


const useStyles = createStylesheet((theme) => ({
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
        marginTodp: 8,
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

    rowBig: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10, // TODO ROLLBACK
        // backgroundColor: 'blue',
    },
    unitIconBig: {
        width: iconWidth,
        height: iconHeight,
        // borderWidth: 1,
        // borderColor: '#555',
    },
    unitIconBigTitle: {
        flex: 1,
        paddingLeft: 8,
        // backgroundColor: 'red',
    },
    unitIconBigBanner: {
        position: 'absolute',
        width: iconWidth/2.0,
        height: iconHeight/2.0,
        left: iconWidth/2.0,
        bottom: -1,//iconHeight/2.0,
    },
    relativeContainer: {
        position: "relative",
        width: iconWidth,
        height: iconHeight,
    },

    resRow: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center',
        // backgroundColor: 'blue',
    },
    resIcon: {
        width: 22,
        height: 22,
        marginRight: 5,
    },
    resDescription: {
        marginRight: 20,
    },

    costsRow: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 5,
        // backgroundColor: 'blue',
    },

    description: {
        lineHeight: '20px',
    },
    container: {
        flex: 1,
        minHeight: '100%',
        padding: 20,
    },
}));

interface Props {
    buildingId: Building;
}

function BuildingView({buildingId}: Props) {
    const appClasses = useAppStyles();
    const classes = useStyles();
    const theme = useTheme();

    const data = getBuildingData(buildingId);

    return (
        <Paper className={appClasses.box}>
            <Typography variant="body1" noWrap>
                {buildingId}
            </Typography>
            <br/>

            <div className={classes.costsRow}>
                {
                    sortResources(keysOf(data.Cost)).map(res =>
                        <div key={res} className={classes.resRow}>
                            <img className={classes.resIcon} src={getOtherIcon(res as Other)}/>
                            <div className={classes.resDescription}>{data.Cost[res]}</div>
                        </div>
                    )
                }
                <div className={classes.description}>Built in {data.TrainTime}s</div>
            </div>

            <div className={classes.description}>{getBuildingDescription(buildingId)}</div>
            <Space/>

            {/*<BuildingStats buildingId={buildingId} />*/}

            <CivAvailability building={buildingId}/>

            <div className={appClasses.expanded}/>
            {/*<Fandom articleName={getBuildingName(building)}/>*/}
        </Paper>
    );
}

export async function getStaticPaths() {
    // Get the paths we want to pre-render based on posts
    const paths = buildingList.map((building) => `/building/${building.name}`)

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
    return { props: { buildingId: params.buildingId } }
}


export default BuildingView
// export default withApollo(Civilization, {ssr:true})
