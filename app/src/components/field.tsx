import { textColors } from '@app/utils/text.util';
import { TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from 'react-native';

import { Icon } from './icon';
import { useState } from 'react';

type BaseProps = Omit<TextInputProps, 'style'>;

export interface FieldProps extends BaseProps {
    type?: 'default' | 'search' | 'password' | 'email';
    style?: ViewStyle;
}

export const Field: React.FC<FieldProps> = ({ type: inputType = 'default', style, ...props }) => {
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
        email: {
        },
    };

    const paddingMap = {
        default: 'px-4',
        search: 'px-8',
        password: 'px-4',
        email: 'pl-4 pr-8',
        // password: 'px-9',
        // email: 'px-9',
    };

    const padding = paddingMap[inputType];

    return (
        <View className="relative h-[45px]" style={style}>
            {inputType === 'search' ? (
                <View className="absolute left-3 top-0 h-full justify-center z-10">
                    <Icon icon="search" color="subtle" />
                </View>
            ) : null}
            {/*{inputType === 'email' ? (*/}
            {/*    <View className="absolute left-3 top-0 h-full justify-center z-10">*/}
            {/*        <Icon icon="envelope" color="subtle" />*/}
            {/*    </View>*/}
            {/*) : null}*/}
            {/*{inputType === 'password' ? (*/}
            {/*    <View className="absolute left-3 top-0 h-full justify-center z-10">*/}
            {/*        <Icon icon="lock-alt" color="subtle" />*/}
            {/*    </View>*/}
            {/*) : null}*/}
            <TextInput
                {...typeOptions[inputType]}
                {...props}
                placeholderTextColor="#a3a3a3"
                className={`bg-white dark:bg-blue-900 rounded-lg border border-gray-200 dark:border-gray-800 py-3.5 ${color} ${padding}`}
            />
            {inputType === 'search' && props.value ? (
                <TouchableOpacity className="absolute right-0 px-3 top-0 h-full justify-center" onPress={() => props.onChangeText?.('')}>
                    <Icon icon="times-circle" />
                </TouchableOpacity>
            ) : null}
            {inputType === 'password' ? (
                <TouchableOpacity className="absolute right-0 px-3 top-0 h-full justify-center" onPress={() => setSecureTextEntry(x => !x)}>
                    <Icon icon={secureTextEntry ? 'eye' : 'eye-slash'} />
                </TouchableOpacity>
            ) : null}
        </View>
    );
};
