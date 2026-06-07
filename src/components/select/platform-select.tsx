import React from 'react';
import ButtonPicker from "@app/view/components/button-picker";
import { faComputerMouse, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@app/components/icon';

export function PlatformSelect(props: any) {
    const { platform, setPlatform } = props;

    const platformValues: string[] = ['pc', 'console'];
    const formatPlatform = (platform: string, props: { color: string }) => {
        if (platform === 'pc')
            return (
                <Icon icon={faComputerMouse} color={props.color} size={16} />
            );
        if (platform === 'console') return (
            <Icon icon={faGamepad} color={props.color} size={20} />
        );
        return <></>;
    };

    return (
        <ButtonPicker value={platform} values={platformValues} formatter={formatPlatform as any} onSelect={setPlatform} />
    );
}
