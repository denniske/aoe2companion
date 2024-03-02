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
            <TextInput
                {...typeOptions[inputType]}
                {...props}
                placeholderTextColor="#a3a3a3"
                className={`bg-white dark:bg-blue-900 rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-3.5 ${color}`}
            />
            {inputType === 'search' && props.value ? (
                <TouchableOpacity className="absolute right-3 top-4" onPress={() => props.onChangeText?.('')}>
                    <Icon icon="times-circle" />
                </TouchableOpacity>
            ) : null}
        </View>
    );
};
