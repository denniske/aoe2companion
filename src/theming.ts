import {useTheme as usePaperTheme2} from "react-native-paper";

export const usePaperTheme = usePaperTheme2;

const light: ITheme = {
    backgroundColor: "white",
    textColor: "black",
    textNoteColor: "#333",
    borderColor: '#CCC',
    lightBorderColor: '#EEE',
    skeletonColor: '#EEE',
    linkColor: '#397AF9',
};

const dark: ITheme = {
    backgroundColor: "#121212",
    textColor: "white",
    textNoteColor: "#BBB",
    borderColor: '#101010',
    lightBorderColor: '#090909',
    skeletonColor: '#111',
    linkColor: '#0A84FF', // from react navigation dark theme primary
};

export function makeVariants<S>(factory: (theme: ITheme) => S): IVariantDict<S> {
    return {
        light: factory(light),
        dark: factory(dark),
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

export interface ITheme {
    backgroundColor: string;
    textColor: string;
    textNoteColor: string;
    borderColor: string;
    lightBorderColor: string;
    skeletonColor: string;
    linkColor: string;
}

interface IVariantDict<S> {
    [key: string]: S;
}
