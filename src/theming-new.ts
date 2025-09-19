import {FinalDarkMode, ITheme} from '@nex/data';
import {appVariants} from './styles';
import {makeVariants, useTheme} from './theming';


export function createStylesheet<S extends (theme: ITheme, mode: FinalDarkMode) => any>(factory: S) {
    const variants = makeVariants(factory);
    const allVariants = {
        light: {...variants.light, base: appVariants.light},
        dark: {...variants.dark, base: appVariants.dark},
    };
    return () => {
        // noinspection UnnecessaryLocalVariableJS
        const appStyles = useTheme(allVariants);
        return appStyles;
    };
}
