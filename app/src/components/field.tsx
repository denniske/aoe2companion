import { textColors } from '@app/utils/text.util';
import { TextInput, TextInputProps } from 'react-native';

export interface FieldProps extends TextInputProps {}

export const Field: React.FC<FieldProps> = ({ ...props }) => {
    const color = textColors['default'];

    return (
        <TextInput
            {...props}
            placeholderTextColor="#a3a3a3"
            className={`bg-white dark:bg-blue-900 rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-3.5 ${color}`}
        />
    );
};
