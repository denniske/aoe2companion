import {dark, FinalDarkMode, ITheme, light} from '@nex/data';
import { useDarkMode } from '@app/app/_layout';

export function makeVariants<S extends (theme: ITheme, mode: FinalDarkMode) => any>(factory: S): IVariantDict<ReturnType<S>> {
    return {
        light: factory(light, 'light'),
        dark: factory(dark, 'dark'),
    };
}

export function useTheme<S>(
    variants: IVariantDict<S>
) {
    const darkMode = useDarkMode();
    return variants[darkMode === 'dark' ? 'dark' : 'light'];
}

export function useAppTheme() {
    const darkMode = useDarkMode();
    return darkMode === 'dark' ? dark : light;
}

export function useAppThemeInverted() {
    const darkMode = useDarkMode();
    return darkMode === 'dark' ? light : dark;
}

interface IVariantDict<S> {
    [key: string]: S;
}
