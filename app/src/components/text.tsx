import { TextColor, TextVariant, textColors, textVariantStyles } from '@app/utils/text.util';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';

export interface TextProps extends RNTextProps {
    align?: NonNullable<TextStyle['textAlign']>;
    color?: TextColor;
    variant?: TextVariant;
}

export const Text: React.FC<TextProps> = ({ variant = 'body', color = 'default', align, style, ...props }) => {
    const textColor = textColors[color] ?? color;

    return <RNText className={`${textColor}`} style={[{ textAlign: align }, textVariantStyles[variant], style]} {...props} />;
};
