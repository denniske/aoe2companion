import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { MyText } from '@app/view/components/my-text';
import { getTranslation } from '@app/helper/translate';
import { GestureResponderEvent, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Icon } from '@app/components/icon';

export { IconName, IconPrefix };

export interface CheckboxProps {
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
    checked?: boolean;
    text?: string;
    disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onPress, text, disabled }) => {
    return (
        <TouchableOpacity activeOpacity={1} onPress={onPress} disabled={disabled}>
            <View className="flex flex-row items-center gap-2 p-2">
                {checked && <Icon icon="square-check" color="brand" size={20} />}
                {!checked && <Icon icon="square" color="brand" prefix="fasr" size={20} />}
                <MyText>{text ?? (checked ? getTranslation('checkbox.active') : getTranslation('checkbox.inactive'))}</MyText>
            </View>
        </TouchableOpacity>
    );
};
