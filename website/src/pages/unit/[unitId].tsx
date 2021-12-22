import React from 'react';
import {getUnitDescription, getUnitLineIdForUnit, getUnitLineNameForUnit, Unit, unitLines, unitList} from "@nex/data";
import Space from "../../components/space";
import {MyText, View, StyleSheet} from '../../components/compat';
import {createStylesheet} from '../../helper/styles';
import {useAppStyles} from '../../components/app-styles';
import {Paper} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';


function UnitView({unitId}: {unitId: Unit}) {
    const appStyles = useAppStyles();
    const styles = useStyles();
    const unitLineId = getUnitLineIdForUnit(unitId);
    const unitLineName = getUnitLineNameForUnit(unitId);
    const unitLine = unitLines[unitLineId];

    return (
        <Paper className={appStyles.box}>
            <Typography variant="body1" noWrap>
                {unitId}
            </Typography>
            <br/>
            {/*<UnitCosts unitLineId={unitLineId} unitId={unitId}/>*/}

            <MyText style={styles.description}>{getUnitDescription(unitId)}</MyText>
            <Space/>

            {/*<UnitRelated unitId={unitId}/>*/}

            {/*<UnitStats unitLineId={unitLineId} unitId={unitId} />*/}

            {/*<UnitCounters unitId={unitId}/>*/}

            {/*<UnitUpgrades unitLineId={unitLineId} unitId={unitId} />*/}

            {/*{*/}
            {/*    !getAbilityEnabledForAllCivs({unit: unitId}) &&*/}
            {/*    <>*/}

            {/*        <View style={styles.row}>*/}
            {/*            <MyText style={styles.header1}>*/}
            {/*                Availability*/}
            {/*            </MyText>*/}
            {/*        </View>*/}
            {/*        <Space/>*/}
            {/*        <CivAvailability unit={unitId}/>*/}
            {/*    </>*/}
            {/*}*/}

            <View style={appStyles.expanded}/>
            {/*<Fandom articleName={getUnitName(unitId)}/>*/}
        </Paper>
    );
}

const useStyles = createStylesheet(theme => ({
    row: {
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center',
        // backgroundColor: 'blue',
    },
    header1: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 500,
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
    const paths = unitList.map((unit) => `/unit/${unit.name}`)

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    // return { paths, fallback: false }
    return { paths: [], fallback: false }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
    // params contains the post `id`.
    // If the route is like /posts/1, then params.id is 1
    // const res = await fetch(`https://.../posts/${params.id}`)
    // const post = await res.json()

    // Pass post data to the page via props
    return { props: { unitId: params.unitId } }
}


export default UnitView
// export default withApollo(Civilization, {ssr:true})
