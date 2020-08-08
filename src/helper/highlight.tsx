import {useTheme} from "../theming";
import {appVariants} from "../styles";
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../App";
import {getTechName, techList} from "./techs";
import {getUnitLineNameForUnit, getUnitName, Unit, units} from "./units";
import {escapeRegExpFn} from "./util";
import {MyText} from "../view/components/my-text";
import React from "react";

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



export function highlightUnitAndTechs(str: string) {
    const appStyles = useTheme(appVariants);
    const navigation = useNavigation<RootStackProp>();

    const techReplaceList = techList.map(t => ({ name: t.name, text: getTechName(t.name)}));
    const unitReplaceList = Object.keys(units).map(t => ({ name: getUnitLineNameForUnit(t as Unit), text: getUnitName(t as Unit)}));
    const reverseTechMap = Object.assign({}, ...techReplaceList.map((x) => ({[x.text]: x})));
    const reverseUnitMap = Object.assign({}, ...unitReplaceList.map((x) => ({[x.text]: x})));

    const allReplaceList = [...techReplaceList, ...unitReplaceList];

    const regex = new RegExp('('+allReplaceList.map(m => '\\b'+escapeRegExpFn(m.text)+'\\b').join("|")+')', '');

    const parts = str.split(regex);
    // console.log('parts', parts);
    // console.log('map', map);

    const texts = [];
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 == 0) {
            texts.push(<MyText key={i}>{parts[i]}</MyText>);
        } else {
            // console.log('part', parts[i]);
            const matchingTech = reverseTechMap[parts[i]]?.name;
            if (matchingTech) {
                texts.push(<MyText key={i} style={appStyles.link} onPress={() => navigation.push('Tech', {tech: matchingTech})}>{parts[i]}</MyText>);
            }
            const matchingUnit = reverseUnitMap[parts[i]]?.name;
            if (matchingUnit) {
                texts.push(<MyText key={i} style={appStyles.link} onPress={() => navigation.push('Unit', {unit: matchingUnit})}>{parts[i]}</MyText>);
            }
        }
    }
    return texts;
}
