import { Uniwind } from 'uniwind';

const colorGold50 = Uniwind.getCSSVariable('--color-gold-50') as string;
const colorBlue950 = Uniwind.getCSSVariable('--color-blue-950') as string;

const colorWhite = Uniwind.getCSSVariable('--color-white') as string;
const colorBlue900 = Uniwind.getCSSVariable('--color-blue-900') as string;

const colorGray200 = Uniwind.getCSSVariable('--color-gray-200') as string;
const colorGray800 = Uniwind.getCSSVariable('--color-gray-800') as string;

export const widgetStyle = {
    light: {
        backgroundColor: colorGold50,
            foregroundColor: '#000000',
            foregroundNoteColor: '#888888',
            cardBackgroundColor: colorWhite,
            cardBorderColor: colorGray200,
    },
    dark: {
        backgroundColor: colorBlue950,
            foregroundColor: '#ffffff',
            foregroundNoteColor: '#888888',
            cardBackgroundColor: colorBlue900,
            cardBorderColor: colorGray800,
    }
};

// type IWidgetStyle = {
//     backgroundColor: string;
//     foregroundColor: string;
//     foregroundNoteColor: string;
//     cardBackgroundColor: string;
//     cardBorderColor: string;
// }
// style: Record<'light' | 'dark', IWidgetStyle>;
