import React from 'react';
import {
    getAffectedUnitInfos, getTechData, getTechDescription, getUpgradeList, keysOf, Other, sortResources, Tech, techList,
    techsAffectingAllUnits
} from "@nex/data";
import CivAvailability from "../../components/civ-availability";
import Space from "../../components/space";
import {Image, MyText, View} from "../../components/compat";
import {createStylesheet} from '../../helper/styles';
import {getOtherIcon} from '../../helper/other';
import {useAppStyles} from '../../components/app-styles';
import {Paper} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import {UnitCompBig} from '../civilization/[civId]';
import {capitalize} from 'lodash';


function TechView({techId}: {techId: Tech}) {
    const styles = useStyles();
    const appStyles = useAppStyles();
    const data = getTechData(techId);

    const affectedUnitInfos = getAffectedUnitInfos(techId);
    // console.log(affectedUnitInfos);

    return (
        <Paper className={appStyles.box}>
            <Typography variant="body1" noWrap>
                {techId}
            </Typography>
            <br/>
            <View style={styles.costsRow}>
                {
                    sortResources(keysOf(data.Cost)).map(res =>
                        <View key={res} style={styles.resRow}>
                            <Image style={styles.resIcon} source={getOtherIcon(res as Other)}/>
                            <MyText style={styles.resDescription}>{data.Cost[res]}</MyText>
                        </View>
                    )
                }
                <MyText style={styles.description}>Researched in {data.ResearchTime}s</MyText>
            </View>

            <MyText style={styles.description}>{getTechDescription(techId)}</MyText>
            <Space/>

            <CivAvailability tech={techId}/>

            {
                !techsAffectingAllUnits.includes(techId) && affectedUnitInfos.length > 0 &&
                <View>
                    <Space/>
                    <MyText>Affected Units</MyText>
                    <Space/>
                    {
                        affectedUnitInfos.map(affectedUnit =>
                            <UnitCompBig key={affectedUnit.unitId} unit={affectedUnit.unitId} subtitle={
                                getUpgradeList(techId, affectedUnit).map(g => g.name + ': ' + capitalize(g.upgrades.join(', '))).join('\n')
                            }/>
                        )
                    }
                </View>
            }

            <View style={appStyles.expanded}/>
            {/*<Fandom articleName={getTechName(tech)}/>*/}
        </Paper>
    );
}


const useStyles = createStylesheet((theme) => ({
    resRow: {
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


export async function getStaticPaths() {
    // Get the paths we want to pre-render based on posts
    const paths = techList.map((tech) => `/tech/${tech.name}`)

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
    return { props: { techId: params.techId } }
}


export default TechView
// export default withApollo(Civilization, {ssr:true})
