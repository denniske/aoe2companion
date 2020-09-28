import * as CSS from 'csstype';
import {Property} from "csstype";
import {makeStyles} from "@material-ui/core/styles";
import {Theme as DefaultTheme} from "@material-ui/core/styles/createMuiTheme";

import {dark, FinalDarkMode, ITheme, light} from '@nex/data';
import {merge} from 'lodash';

interface IVariantDict<S> {
    [key: string]: S;
}

interface StandardCSSProperties extends CSS.Properties<number | string> {}

interface CustomCSSProperties extends CSS.Properties<number | string> {
    'marginVertical'?: Property.MarginBottom<number | string>;
}

type CustomCssStyles = Record<string, StandardCSSProperties>;

type NamedStyles<T> = { [P in keyof T]: CustomCSSProperties };
type NamedClasses<T> = { [P in keyof T]: string };

type StyleFromProp<T> = (props?: any) => NamedClasses<T>;

function processStyles(styles: any) {
    for (const className in styles) {
        const props = Object.keys(styles[className]);
        if (props.includes('marginVertical')) {
            styles[className].marginTop = styles[className]['marginVertical'];
            styles[className].marginBottom = styles[className]['marginVertical'];
            delete styles[className].marginVertical;
        }
        if (props.includes('marginHorizontal')) {
            styles[className].marginLeft = styles[className]['marginHorizontal'];
            styles[className].marginRight = styles[className]['marginHorizontal'];
            delete styles[className].marginVertical;
        }
        if (props.includes('paddingVertical')) {
            styles[className].paddingTop = styles[className]['paddingVertical'];
            styles[className].paddingBottom = styles[className]['paddingVertical'];
            delete styles[className].paddingVertical;
        }
        if (props.includes('paddingHorizontal')) {
            styles[className].paddingLeft = styles[className]['paddingHorizontal'];
            styles[className].paddingRight = styles[className]['paddingHorizontal'];
            delete styles[className].paddingVertical;
        }
        if (props.includes('flexDirection')) {
            styles[className].display = 'flex';
        }
    }
    return styles;
}

export function createStylesheet<T extends NamedStyles<T>>(styles: (theme: DefaultTheme & ITheme) => T): StyleFromProp<T> {

    // console.log(styles);



    const mystyles = styles as any;
    return makeStyles(theme => {
        const mytheme = theme.palette.type === 'light' ? light : dark;
        return processStyles(mystyles(merge(theme, mytheme)));
    }) as any as StyleFromProp<T>;
}




export function makeVariants<S extends (theme: ITheme, mode: FinalDarkMode) => any>(factory: S): IVariantDict<ReturnType<S>> {
    return {
        light: factory(light, 'light'),
        dark: factory(dark, 'dark'),
    };
}

export function useTheme<S>(
    variants: IVariantDict<S>
) {
    const paperTheme = { dark: true}; // usePaperTheme();
    return variants[paperTheme.dark ? 'dark' : 'light'];
}

export function createStylesheet2<S extends (theme: ITheme, mode: FinalDarkMode) => any>(factory: S) {
    return () => {
        // noinspection UnnecessaryLocalVariableJS
        const hookResult = useTheme(makeVariants(factory));
        return hookResult;
    };
}



// export function useAppTheme() {
//     const paperTheme = usePaperTheme();
//     return paperTheme.dark ? dark : light;
// }


















// export function createStylesheet<T extends NamedStyles<T>>(styles: T): StyleFromProp<T> {
//
//     for (const className in styles) {
//         const props = Object.keys(styles[className]);
//         if (props.includes('marginVertical')) {
//             styles[className].marginTop = styles[className]['marginVertical'];
//             styles[className].marginBottom = styles[className]['marginVertical'];
//             delete styles[className].marginVertical;
//         }
//     }
//
//     // console.log(styles);
//
//     const mystyles = styles as any;
//     return makeStyles(theme => mystyles) as any as StyleFromProp<T>;
// }
