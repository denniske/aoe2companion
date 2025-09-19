import {StyleSheet} from "react-native";
import {makeVariants, useTheme} from "./theming";
import {FinalDarkMode, ITheme} from '@nex/data';


// export const linkColor = '#397AF9';
// export const linkColor = '#3498db';
// export const linkColor = 'rgb(10, 132, 255)';

function createMasterStylesheet<S extends (theme: ITheme, mode: FinalDarkMode) => any>(factory: S) {
    const variants = makeVariants(factory);
    return () => {
        // noinspection UnnecessaryLocalVariableJS
        const hookResult = useTheme(variants);
        return hookResult;
    };
}

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        link: {
            color: theme.linkColor,
        },
        expanded: {
            flex: 1,
        },
        tabular: {
            fontVariant: ['tabular-nums'],
        },
        tabularRight: {
            textAlign: 'right',
            fontVariant: ['tabular-nums'],
        },
        small: {
            fontSize: 12,
            color: theme.textNoteColor,
        },
    });
};

export const appVariants = makeVariants(getStyles);

export const useAppStyles = createMasterStylesheet(getStyles);
