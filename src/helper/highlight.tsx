import { useTheme } from '../theming';
import { appVariants } from '../styles';
import { buildingDefList, escapeRegExpFn, getBuildingName, getTechName, getUnitName, hasUnitLine, techList, Unit, units } from '@nex/data';
import { MyText } from '../view/components/my-text';
import React from 'react';
import { memoize } from 'lodash';
import { getLanguage } from '../../data/src/lib/aoe-data';
import { Link } from 'expo-router';

// export function highlightUnitAndCivs(str: string) {
//     const appStyles = useTheme(appVariants);
//     const navigation = useNavigation<RootStackProp>();
//
//     const civReplaceList = civs.map(civ => ({ name: civ, text: civ}));
//     const unitReplaceList = Object.keys(units).map(t => ({ name: getUnitLineNameForUnit(t as Unit), text: getUnitName(t as Unit)}));
//     const reverseCivMap = Object.assign({}, ...civReplaceList.map((x) => ({[x.text]: x})));
//     const reverseUnitMap = Object.assign({}, ...unitReplaceList.map((x) => ({[x.text]: x})));
//
//     const allReplaceList = [...civReplaceList, ...unitReplaceList];
//
//     const regex = new RegExp('('+allReplaceList.map(m => '\\b'+escapeRegExpFn(m.text)+'\\b').join("|")+')', '');
//
//     const parts = str.split(regex);
//     // console.log('parts', parts);
//     // console.log('map', map);
//
//     const texts = [];
//     for (let i = 0; i < parts.length; i++) {
//         if (i % 2 == 0) {
//             texts.push(<MyText key={i}>{parts[i]}</MyText>);
//         } else {
//             // console.log('part', parts[i]);
//             const matchingTech = reverseCivMap[parts[i]]?.name;
//             if (matchingTech) {
//                 texts.push(<MyText key={i} style={appStyles.link} onPress={() => navigation.push('Tech', {tech: matchingTech})}>{parts[i]}</MyText>);
//             }
//             const matchingUnit = reverseUnitMap[parts[i]]?.name;
//             if (matchingUnit) {
//                 texts.push(<MyText key={i} style={appStyles.link} onPress={() => navigation.push('Unit', {unit: matchingUnit})}>{parts[i]}</MyText>);
//             }
//         }
//     }
//     return texts;
// }

function createLists() {
    const techReplaceList = techList.map((t) => ({ name: t.name, text: getTechName(t.name) }));
    const unitReplaceList = Object.keys(units)
        .filter((t) => hasUnitLine(t as Unit))
        .map((t) => ({ name: t, text: getUnitName(t as Unit) }));
    const buildingReplaceList = buildingDefList.map((b) => ({ name: b.name, text: getBuildingName(b.name) }));
    const reverseTechMap = Object.assign({}, ...techReplaceList.map((x) => ({ [x.text.toLowerCase()]: x })));
    const reverseUnitMap = Object.assign({}, ...unitReplaceList.map((x) => ({ [x.text.toLowerCase()]: x, [x.text.toLowerCase() + 's']: x })));
    const reverseBuildingMap = Object.assign({}, ...buildingReplaceList.map((x) => ({ [x.text.toLowerCase()]: x, [x.text.toLowerCase() + 's']: x })));

    const allReplaceList = [...techReplaceList, ...unitReplaceList, ...buildingReplaceList];

    const regex = new RegExp('(' + allReplaceList.map((m) => '\\b' + escapeRegExpFn(m.text) + 's?\\b').join('|') + ')', 'i');

    return { regex, reverseTechMap, reverseUnitMap, reverseBuildingMap };
}

// Memoize per language
const memoizedCreateLists = memoize((language: string) => createLists());

interface IProps {
    str: string;
}

export function HighlightUnitAndTechs(props: IProps) {
    const { str } = props;
    const appStyles = useTheme(appVariants);
    const { regex, reverseTechMap, reverseUnitMap, reverseBuildingMap } = memoizedCreateLists(getLanguage());

    const parts = str.split(regex);
    // console.log('parts', parts);
    // console.log('map', map);

    const texts = [];
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 == 0) {
            texts.push(<MyText key={i}>{parts[i]}</MyText>);
        } else {
            // console.log('part', parts[i]);
            const matchingTech = reverseTechMap[parts[i].toLowerCase()]?.name;
            if (matchingTech) {
                texts.push(
                    <Link asChild href={`/explore/technologies/${matchingTech}`} key={i}>
                        <MyText style={appStyles.link} className="hover:underline">
                            {parts[i]}
                        </MyText>
                    </Link>
                );
                continue;
            }
            const matchingUnit = reverseUnitMap[parts[i].toLowerCase()]?.name;
            if (matchingUnit) {
                texts.push(
                    <Link asChild href={`/explore/units/${matchingUnit}`} key={i}>
                        <MyText style={appStyles.link} className="hover:underline">
                            {parts[i]}
                        </MyText>
                    </Link>
                );
                continue;
            }
            const matchingBuilding = reverseBuildingMap[parts[i].toLowerCase()]?.name;
            if (matchingBuilding) {
                texts.push(
                    <Link asChild href={`/explore/buildings/${matchingBuilding}`} key={i}>
                        <MyText style={appStyles.link} className="hover:underline">
                            {parts[i]}
                        </MyText>
                    </Link>
                );
            }
        }
    }
    return <MyText>{texts}</MyText>;
}

interface IProps2 {
    str: string;
    highlight: string;
}

export function Highlight(props: IProps2) {
    const { str, highlight } = props;
    const appStyles = useTheme(appVariants);

    // const regex = new RegExp('(\\b'+escapeRegExpFn(highlight)+'s?\\b)', 'i');
    const regex = new RegExp('(' + escapeRegExpFn(highlight) + ')', 'i');
    const parts = str.split(regex);
    // console.log('parts', regex);
    // console.log('parts', parts);
    // console.log('map', map);

    const texts = [];
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 == 0) {
            texts.push(<MyText key={i}>{parts[i]}</MyText>);
        } else {
            texts.push(
                <MyText key={i} style={{ fontWeight: 'bold' }}>
                    {parts[i]}
                </MyText>
            );
            // console.log('part', parts[i]);
            // const matchingTech = reverseTechMap[parts[i].toLowerCase()]?.name;
            // if (matchingTech) {
            //     texts.push(<MyText key={i} style={appStyles.link} onPress={() => navigation.push('Tech', {tech: matchingTech})}>{parts[i]}</MyText>);
            // }
            // const matchingUnit = reverseUnitMap[parts[i].toLowerCase()]?.name;
            // if (matchingUnit) {
            //     texts.push(<MyText key={i} style={appStyles.link} onPress={() => navigation.push('Unit', {unit: matchingUnit})}>{parts[i]}</MyText>);
            // }
        }
    }
    return <MyText>{texts}</MyText>;
}
