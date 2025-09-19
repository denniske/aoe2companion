import { TextColor, TextVariant, textColors, textVariantStyles } from '@app/utils/text.util';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';

export interface TextProps extends RNTextProps {
    align?: NonNullable<TextStyle['textAlign']>;
    color?: TextColor;
    variant?: TextVariant;
}

export const Text: React.FC<TextProps> = ({ variant = 'body', color = 'default', align, style, className, ...props }) => {
    const textColor = textColors[color] ?? color;

    // if (props.children === 'Matches' && className?.includes('!text-[9px]')) {
    //     console.log('text', props.children, `${className ?? ''} ${textColor} `, style);
    //
    // }

    //  ${textColor}

    // console.log('text', props.children, `${className ?? ''} ${textColor} `);

    const style2 = {
        textAlign: align,
        ...textVariantStyles[variant],
        ...(style as any ?? {}),
    }

    // return <RNText className={`${textColor}`} style={[{ textAlign: 'center' }]}>Test</RNText>;
    // return <RNText className={`${textColor}`} style={[{ textAlign: align }]} {...props} />;
    return <RNText className={`${className} ${textColor} `} style={style2} {...props} />;
};

// export const Text: React.FC<TextProps> = ({ color, children }) => {
//     const textColor = textColors[color as any];
//
//     // if (props.children === 'Matches' && className?.includes('!text-[9px]')) {
//     //     console.log('text', props.children, `${className ?? ''} ${textColor} `, style);
//     //
//     // }
//
//     //  ${textColor}
//
//     return <RNText className={textColor} style={[{ textAlign: 'center' }]}>{children}</RNText>;
//     // return <RNText className={`${textColor}`} style={[{ textAlign: align }]} {...props} />;
//     // return <RNText className={`${className} ${textColor} `} style={[{ textAlign: align }, textVariantStyles[variant], style]} {...props} />;
// };

// export const Text: React.FC<TextProps> = ({ className, children }) => {
//     // const textColor = textColors[color as any];
//
//     // if (props.children === 'Matches' && className?.includes('!text-[9px]')) {
//     //     console.log('text', props.children, `${className ?? ''} ${textColor} `, style);
//     //
//     // }
//
//     //  ${textColor}
//
//     return <RNText className={className} style={{ textAlign: 'center' }}>{children}</RNText>;
//     // return <RNText className={`${textColor}`} style={[{ textAlign: align }]} {...props} />;
//     // return <RNText className={`${className} ${textColor} `} style={[{ textAlign: align }, textVariantStyles[variant], style]} {...props} />;
// };
