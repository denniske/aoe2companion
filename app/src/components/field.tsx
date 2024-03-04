import { textColors } from '@app/utils/text.util';
import { TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

import { Icon } from './icon';

export interface FieldProps extends TextInputProps {
    type?: 'default' | 'search';
}

export const Field: React.FC<FieldProps> = ({ type: inputType = 'default', ...props }) => {
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
    };

    return (
        <View className="relative">
            {inputType === 'search' ? (
                <View className="absolute left-3 top-0 h-full justify-center z-10">
                    <Icon icon="search" color="subtle" />
                </View>
            ) : null}
            <TextInput
                {...typeOptions[inputType]}
                {...props}
                placeholderTextColor="#a3a3a3"
                className={`bg-white dark:bg-blue-900 rounded-lg border border-gray-200 dark:border-gray-800 py-3.5 ${color} ${inputType === 'search' ? 'px-8' : 'px-4'}`}
            />
            {inputType === 'search' && props.value ? (
                <TouchableOpacity className="absolute right-3 top-0 h-full justify-center" onPress={() => props.onChangeText?.('')}>
                    <Icon icon="times-circle" />
                </TouchableOpacity>
            ) : null}
        </View>
    );
};
