import { createStylesheet } from '../../theming-new';
import { GestureResponderEvent, Pressable, StyleSheet } from 'react-native';
import { MyText } from './my-text';

export interface ButtonProps {
    disabled?: boolean;
    children: string;
    onPress?: (event: GestureResponderEvent) => void;
    fullWidth?: boolean;
    hollow?: boolean;
    size?: 'large' | 'small';
}

export const BuildOrderButton: React.FC<ButtonProps> = ({ disabled, children, onPress, fullWidth, hollow, size = 'large' }) => {
    const styles = useStyles();

    return (
        <Pressable
            disabled={disabled}
            style={({ pressed }) => [
                styles.button,
                size === 'small' && styles.buttonSmall,
                pressed && styles.buttonPressed,
                disabled && styles.buttonDisabled,
                hollow && styles.buttonHollow,
                fullWidth && styles.buttonFull,
            ]}
            onPress={onPress}
        >
            <MyText style={[styles.buttonText, hollow && styles.buttonTextHollow, size === 'small' && styles.buttonTextSmall]}>{children}</MyText>
        </Pressable>
    );
};

const useStyles = createStylesheet((theme, darkMode) =>
    StyleSheet.create({
        button: {
            backgroundColor: theme.hoverBackgroundColor,
            padding: 12,
            alignItems: 'center',
            borderRadius: 4,
            borderWidth: 2,
            borderColor: 'transparent',
        },
        buttonSmall: {
            padding: 5,
        },
        buttonPressed: {
            opacity: 0.6,
        },
        buttonDisabled: {
            opacity: 0.2,
        },
        buttonFull: {
            flex: 1,
        },
        buttonHollow: {
            backgroundColor: 'transparent',
            borderColor: theme.borderColor,
        },
        buttonText: {
            color: theme.textColor,
            textTransform: 'uppercase',
            fontWeight: 'bold',
        },
        buttonTextHollow: {
            color: theme.textColor,
        },
        buttonTextSmall: {
            fontSize: 12,
            textTransform: 'none',
            fontWeight: '500',
        },
    })
);
