
export type TextColor = 'default' | 'brand' | 'subtle' | string;
export type TextVariant =
    | 'nav'
    | 'body-tn'
    | 'body-xs'
    | 'body-sm'
    | 'body'
    | 'body-lg'
    | 'body-xl'
    | 'label-xs'
    | 'label-sm'
    | 'label'
    | 'label-lg'
    | 'header-xs'
    | 'header-sm'
    | 'header'
    | 'header-lg'
    | 'title';

export const textVariantStyles: Record<TextVariant, { fontSize: number; lineHeight: number; fontFamily: string }> = {
    'nav': { fontSize: 9, lineHeight: 12, fontFamily: 'Roboto_700Bold' },
    'body-tn': { fontSize: 8, lineHeight: 12, fontFamily: 'Roboto_400Regular' },
    'body-xs': { fontSize: 10, lineHeight: 14, fontFamily: 'Roboto_400Regular' },
    'body-sm': { fontSize: 12, lineHeight: 16, fontFamily: 'Roboto_400Regular' },
    body: { fontSize: 14, lineHeight: 20, fontFamily: 'Roboto_400Regular' },
    'body-lg': { fontSize: 16, lineHeight: 24, fontFamily: 'Roboto_400Regular' },
    'body-xl': { fontSize: 18, lineHeight: 26, fontFamily: 'Roboto_400Regular' },
    'label-xs': { fontSize: 10, lineHeight: 14, fontFamily: 'Roboto_500Medium' },
    'label-sm': { fontSize: 12, lineHeight: 16, fontFamily: 'Roboto_500Medium' },
    label: { fontSize: 14, lineHeight: 20, fontFamily: 'Roboto_500Medium' },
    'label-lg': { fontSize: 16, lineHeight: 24, fontFamily: 'Roboto_500Medium' },
    'header-xs': { fontSize: 14, lineHeight: 20, fontFamily: 'Roboto_700Bold' },
    'header-sm': { fontSize: 16, lineHeight: 24, fontFamily: 'Roboto_700Bold' },
    header: { fontSize: 18, lineHeight: 26, fontFamily: 'Roboto_700Bold' },
    'header-lg': { fontSize: 20, lineHeight: 28, fontFamily: 'Roboto_700Bold' },
    title: { fontSize: 36, lineHeight: 40, fontFamily: 'Roboto_900Black' },
};

export const textColors: Record<TextColor, string | undefined> = {
    link: 'text-[#397AF9] dark:text-[#0A84FF]',

    foreground: 'text-foreground',
    white: 'text-white',
    brand: 'text-brand',

    subtle: 'text-subtle',
    default: 'text-black dark:text-white',
};

export const accentColors: Record<TextColor, string | undefined> = {
    link: 'text-[#397AF9] dark:text-[#0A84FF]',

    foreground: 'accent-foreground',
    white: 'accent-white',
    brand: 'accent-brand',

    subtle: 'accent-subtle',
    default: 'text-black dark:text-white',
};
