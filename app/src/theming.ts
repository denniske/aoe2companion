import {useTheme as usePaperTheme2} from "react-native-paper";
import {FinalDarkMode} from "./redux/reducer";

export const usePaperTheme = usePaperTheme2;

const light: ITheme = {
    backgroundColor: "white",
    textColor: "black",
    textNoteColor: "#333",
    borderColor: '#AAA',
    hoverBackgroundColor: '#CCC',
    lightBackgroundColor: '#AAA',
    lightBorderColor: '#EEE',
    skeletonColor: '#EEE',
    linkColor: '#397AF9',
};

const dark: ITheme = {
    backgroundColor: "#121212",
    textColor: "white",
    textNoteColor: "#BBB",
    borderColor: '#101010',
    hoverBackgroundColor: '#555',
    lightBackgroundColor: '#333',
    lightBorderColor: '#101010',
    skeletonColor: '#111',
    linkColor: '#0A84FF', // from react navigation dark theme primary
};

export function makeVariants<S extends (theme: ITheme, mode: FinalDarkMode) => any>(factory: S): IVariantDict<ReturnType<S>> {
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

export function createStylesheet<S extends (theme: ITheme, mode: FinalDarkMode) => any>(factory: S) {
    return () => useTheme(makeVariants(factory));
}

// export function useTheme2<S>(
//     variants: IVariantDict<S>
// ) {
//     return () => useTheme(variants);
// }

export function useAppTheme() {
    const paperTheme = usePaperTheme();
    return paperTheme.dark ? dark : light;
}

export interface ITheme {
    backgroundColor: string;
    textColor: string;
    textNoteColor: string;
    borderColor: string;
    hoverBackgroundColor: string;
    lightBackgroundColor: string;
    lightBorderColor: string;
    skeletonColor: string;
    linkColor: string;
}

interface IVariantDict<S> {
    [key: string]: S;
}
