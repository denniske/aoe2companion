import {Linking, StyleSheet, Text, View} from "react-native";
import React from "react";
import {MyText} from "./compat";


import * as CSS from 'csstype';
import {Property} from "csstype";
import {makeStyles} from "@material-ui/core/styles";
import {Theme as DefaultTheme} from "@material-ui/core/styles/createTheme";

// interface StandardCSSProperties extends CSS.Properties<number | string> {}
//
// interface CustomCSSProperties extends CSS.Properties<number | string> {
//     'marginVertical'?: Property.MarginBottom<number | string>;
// }
//
// type CustomCssStyles = Record<string, StandardCSSProperties>;
//
// type NamedStyles<T> = { [P in keyof T]: CustomCSSProperties };
// type NamedClasses<T> = { [P in keyof T]: string };
//
// type StyleFromProp<T> = (props?: any) => NamedClasses<T>;
//
// function processStyles(styles: any) {
//     for (const className in styles) {
//         const props = Object.keys(styles[className]);
//         if (props.includes('marginVertical')) {
//             styles[className].marginTop = styles[className]['marginVertical'];
//             styles[className].marginBottom = styles[className]['marginVertical'];
//             delete styles[className].marginVertical;
//         }
//         if (props.includes('marginHorizontal')) {
//             styles[className].marginLeft = styles[className]['marginHorizontal'];
//             styles[className].marginRight = styles[className]['marginHorizontal'];
//             delete styles[className].marginVertical;
//         }
//         if (props.includes('paddingVertical')) {
//             styles[className].paddingTop = styles[className]['paddingVertical'];
//             styles[className].paddingBottom = styles[className]['paddingVertical'];
//             delete styles[className].paddingVertical;
//         }
//         if (props.includes('paddingHorizontal')) {
//             styles[className].paddingLeft = styles[className]['paddingHorizontal'];
//             styles[className].paddingRight = styles[className]['paddingHorizontal'];
//             delete styles[className].paddingVertical;
//         }
//         if (props.includes('flexDirection')) {
//             styles[className].display = 'flex';
//         }
//     }
//     return styles;
// }
//
// export function createStylesheet<T extends NamedStyles<T>>(styles: (theme: DefaultTheme) => T): StyleFromProp<T> {
//
//     // console.log(styles);
//
//     const mystyles = styles as any;
//     return makeStyles(theme => processStyles(mystyles(theme))) as any as StyleFromProp<T>;
// }
//
//
// function useTheme()




interface FandomProps {
    articleName: string;
}

export default function Fandom(props: FandomProps) {
    // const styles = useTheme(variants);
    // const { articleName } = props;
    // return (
    //     <MyText style={styles.container}>
    //         <MyText style={styles.text}>This article uses material from the "{articleName}" article on the </MyText>
    //         <MyText style={styles.link} onPress={() => Linking.openURL('https://ageofempires.fandom.com/wiki/Age_of_Empires_II:Portal')}>Age of Empires II Wiki</MyText>
    //         <MyText style={styles.text}> at </MyText>
    //         <MyText style={styles.link} onPress={() => Linking.openURL('https://www.fandom.com/')}>Fandom</MyText>
    //         <MyText style={styles.text}> and is licensed under the </MyText>
    //         <MyText style={styles.link} onPress={() => Linking.openURL('https://creativecommons.org/licenses/by-sa/3.0/')}>Creative Commons Attribution-Share Alike License</MyText>
    //         <MyText style={styles.text}>.</MyText>
    //     </MyText>
    // );
}

// const getStyles = (theme: ITheme) => {
//     return StyleSheet.create({
//     container: {
//         marginTop: 20,
//         lineHeight: 16,
//     },
//     link: {
//         fontSize: 12,
//         color: theme.linkColor,
//     },
//     text: {
//         fontSize: 12,
//         marginBottom: 5,
//     },
// });
// };
//
// const variants = makeVariants(getStyles);
