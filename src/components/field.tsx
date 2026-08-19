import { PressableOpacity } from '@app/components/pressable-opacity';
import { textColors } from '@app/utils/text.util';
import { TextInput, TextInputProps, View, ViewStyle } from 'react-native';

import { Icon } from './icon';
import { faEye, faEyeSlash, faSearch, faTimesCircle } from '@fortawesome/sharp-solid-svg-icons';
import { useState } from 'react';
import cn from 'classnames';

type BaseProps = Omit<TextInputProps, 'style'>;

export interface FieldProps extends BaseProps {
    type?: 'default' | 'search' | 'password' | 'email';
    style?: ViewStyle;
    iconColor?: string;
}

export const Field: React.FC<FieldProps> = ({ type: inputType = 'default', style, iconColor, ...props }) => {
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const color = textColors['default'];
    const typeOptions: Record<NonNullable<FieldProps['type']>, TextInputProps> = {
        default: {},
        search: {
            enterKeyHint: 'search',
            inputMode: 'search',
            selectTextOnFocus: true,
            autoCorrect: false,
            returnKeyType: 'search',
            accessibilityRole: 'search',
        },
        password: {
            textContentType: 'password',
            secureTextEntry,
        },
        email: {},
    };

    // Padding follows the buttons that are actually rendered: reserving room on
    // the right while no button is there just truncates the placeholder early.
    const hasClearButton = inputType === 'search' && !!props.value;
    const hasPasswordToggle = inputType === 'password';
    const padding = cn(inputType === 'search' ? 'pl-8' : 'pl-4', hasClearButton || hasPasswordToggle ? 'pr-8' : 'pr-4');

    return (
        <View className="relative" style={style}>
            {inputType === 'search' ? (
                <View className="absolute left-3 top-0 h-full justify-center z-10">
                    <Icon icon={faSearch} color={iconColor ?? 'subtle'} />
                </View>
            ) : null}
            <TextInput
                placeholderTextColorClassName="accent-gray-500"
                {...typeOptions[inputType]}
                {...props}
                // Note: Do not set font size here with text-sm because that would lead to text jumping on Android/iOS
                className={cn(
                    `bg-white dark:bg-blue-900 rounded-lg border border-gray-200 dark:border-gray-800 py-3 ${color} ${padding} shadow-xs`,
                    props.className
                )}
            />
            {hasClearButton ? (
                <PressableOpacity className="absolute right-0 px-3 top-0 h-full justify-center" onPress={() => props.onChangeText?.('')}>
                    <Icon icon={faTimesCircle} />
                </PressableOpacity>
            ) : null}
            {hasPasswordToggle ? (
                <PressableOpacity className="absolute right-0 px-3 top-0 h-full justify-center" onPress={() => setSecureTextEntry((x) => !x)}>
                    <Icon icon={secureTextEntry ? faEye : faEyeSlash} color="subtle" />
                </PressableOpacity>
            ) : null}
        </View>
    );
};
