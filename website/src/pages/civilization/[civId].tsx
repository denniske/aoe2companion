import React from 'react';
import Typography from '@material-ui/core/Typography';
import {useTheme} from '@material-ui/core/styles';
import {Paper} from "@material-ui/core";
import {
    Civ, civDict, civs, getTechDescription, getTechName, getUnitName, iconHeight, iconWidth, parseCivDescription, techs,
    Unit
} from "@nex/data";
import {useAppStyles} from "../../components/app-styles";
import {MyLink} from "../../components/link";
import {getUnitIcon} from "../../helper/units";
import {createStylesheet} from "../../helper/styles";
import {getCivIcon} from "../../helper/civs";
import {getTechIcon} from "../../helper/techs";
import {TechTree} from "../../components/tech-tree";


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
        color: theme.textNoteColor,
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
}));


function Civilization({civId}: any) {
    const appClasses = useAppStyles();
    const classes = useStyles();
    const theme = useTheme();
    const civ = civId as Civ;

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

                <div className={classes.box}>
                    <div className={classes.heading}>Unique Unit</div>
                    {
                        civDict[civ].uniqueUnits.map(unit =>
                            <UnitCompBig key={unit} unit={unit}/>
                        )
                    }
                </div>

                <div className={classes.box}>
                    <div className={classes.heading}>Unique Tech</div>
                    {
                        civDict[civ].uniqueTechs.map(tech =>
                            <TechCompBig key={tech} tech={tech}/>
                        )
                    }
                </div>

                <div className={classes.box}>
                    <div className={classes.heading}>{teamBonusTitle.replace(':', '')}</div>
                    <div className={classes.content}>{teamBonus}</div>
                </div>

                <div className={classes.box}>
                    <TechTree civ={civ}/>
                </div>
            </Paper>
        </div>
    );
}

export function UnitCompBig({unit, subtitle}: {unit: Unit, subtitle?: string}) {
    const classes = useStyles();
    return (
        <MyLink href='/unit/[id]' as={`/unit/${unit}`} naked>
            <div className={classes.rowBig}>
                <img src={getUnitIcon(unit)} className={classes.unitIconBig}/>
                <div className={classes.unitIconBigTitle}>
                    <div>{getUnitName(unit)}</div>
                    {
                        subtitle != null &&
                        <div className={classes.small}>{subtitle}</div>
                    }
                </div>
            </div>
        </MyLink>
    );
}

function TechIcon({tech: tech} : any) {
    const classes = useStyles();
    const techInfo = techs[tech];

    if (techInfo.civ) {
        return (
            <div className={classes.relativeContainer}>
                <img className={classes.unitIconBig} src={getTechIcon(tech)}/>
                <img className={classes.unitIconBigBanner} src={getCivIcon(techInfo.civ)}/>
            </div>
        );
    }

    return <img className={classes.unitIconBig} src={getTechIcon(tech)}/>;
}

export function TechCompBig({tech: tech, showCivBanner: showCivBanner}: any) {
    const classes = useStyles();

    return (
        <MyLink href='/tech/[techId]' as={`/tech/${tech}`} naked>
            <div className={classes.rowBig}>
                <TechIcon className={classes.unitIconBig} tech={tech}/>
                <div className={classes.unitIconBigTitle}>
                    <div>{getTechName(tech)}</div>
                    <div className={classes.small}>{getTechDescription(tech)}</div>
                </div>
            </div>
        </MyLink>
    );
}

export async function getStaticPaths() {
    // Get the paths we want to pre-render based on posts
    const paths = civs.map((civ) => `/civilization/${civ}`)

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
    return { props: { civId: params.civId } }
}


export default Civilization
// export default withApollo(Civilization, {ssr:true})
