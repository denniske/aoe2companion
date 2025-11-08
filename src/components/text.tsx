import { TextColor, TextVariant, textColors, textVariantStyles } from '@app/utils/text.util';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';

export interface TextProps extends RNTextProps {
    align?: NonNullable<TextStyle['textAlign']>;
    color?: TextColor;
    variant?: TextVariant;
}

export const Text: React.FC<TextProps> = ({ variant = 'body', color = 'default', align, style, className, ...props }) => {
    const textColor = textColors[color] ?? color;

    const style2 = {
        ...(align ? {textAlign: align} : {}),
        ...textVariantStyles[variant],
        ...(style as any ?? {}),
    }

    // console.log('text', props.children, style2);

    // console.log('TEXT COLOR CLASS NAME', textColor);

    return <RNText className={`${className} ${textColor}`} style={style2} {...props} />;
};
