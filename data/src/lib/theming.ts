
export type FinalDarkMode = 'light' | 'dark';

export const light: ITheme = {
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

export const dark: ITheme = {
    backgroundColor: "#121212",
    textColor: "white",
    textNoteColor: "#BBB",
    // textNoteColor: "white",
    borderColor: '#101010',
    hoverBackgroundColor: '#555',
    lightBackgroundColor: '#333',
    lightBorderColor: '#101010',
    skeletonColor: '#111',
    linkColor: '#0A84FF', // from react navigation dark theme primary
};

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
