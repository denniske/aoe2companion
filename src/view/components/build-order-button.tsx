import { GestureResponderEvent, TouchableOpacity } from 'react-native';
import { Text } from '@app/components/text';
import { FC } from 'react';

export interface ButtonProps {
    disabled?: boolean;
    children: string;
    onPress?: (event: GestureResponderEvent) => void;
    fullWidth?: boolean;
}

export const BuildOrderButton: FC<ButtonProps> = ({ disabled, children, onPress, fullWidth }) => {
    return (
        <TouchableOpacity
            disabled={disabled}
            className={`p-3 items-center rounded-sm bg-hoverBackground ${fullWidth ? 'flex-1' : ''} ${disabled ? 'opacity-20' : ''}`}
            onPress={onPress}
        >
            <Text variant="header-xs" className="uppercase">{children}</Text>
        </TouchableOpacity>
    );
};
