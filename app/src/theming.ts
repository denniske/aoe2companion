import {useTheme as usePaperTheme2} from "react-native-paper";
import {dark, FinalDarkMode, ITheme, light} from '@nex/data';

export const usePaperTheme = usePaperTheme2;

export function makeVariants<S extends (theme: ITheme, mode: FinalDarkMode) => any>(factory: S): IVariantDict<ReturnType<S>> {
    console.log('makeVariants factory');
    return {
        light: factory(light, 'light'),
        dark: factory(dark, 'dark'),
    };
}

export function useTheme<S>(
    variants: IVariantDict<S>
) {
    const paperTheme = usePaperTheme();
    return variants[paperTheme.dark ? 'dark' : 'light'];
}

export function useAppTheme() {
    const paperTheme = usePaperTheme();
    return paperTheme.dark ? dark : light;
}

interface IVariantDict<S> {
    [key: string]: S;
}
