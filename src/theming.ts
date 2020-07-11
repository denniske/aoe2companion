import {useTheme as usePaperTheme2} from "react-native-paper";

export const usePaperTheme = usePaperTheme2;

const light: ITheme = {
    backgroundColor: "white",
    textColor: "black",
    textNoteColor: "#333",
    borderColor: '#CCC',
    skeletonColor: '#EEE',
};
const dark: ITheme = {
    backgroundColor: "#121212",
    textColor: "white",
    textNoteColor: "#BBB",
    borderColor: '#101010',
    skeletonColor: '#111',
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

export interface ITheme {
    backgroundColor: string;
    textColor: string;
    textNoteColor: string;
    borderColor: string;
    skeletonColor: string;
}

interface IVariantDict<S> {
    [key: string]: S;
}
