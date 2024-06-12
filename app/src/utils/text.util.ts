export type TextColor = 'default' | 'brand' | 'subtle' | string;
export type TextVariant =
    | 'body-xs'
    | 'body-sm'
    | 'body'
    | 'body-lg'
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
    'body-xs': { fontSize: 10, lineHeight: 14, fontFamily: 'Roboto_400Regular' },
    'body-sm': { fontSize: 12, lineHeight: 16, fontFamily: 'Roboto_400Regular' },
    body: { fontSize: 14, lineHeight: 20, fontFamily: 'Roboto_400Regular' },
    'body-lg': { fontSize: 16, lineHeight: 24, fontFamily: 'Roboto_400Regular' },
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
    default: 'text-black dark:text-white',
    brand: 'text-blue-600 dark:text-gold-200',
    subtle: 'text-gray-800 dark:text-gray-200',
};
