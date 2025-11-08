import React from 'react';
import {FontAwesome6} from "@expo/vector-icons";
import ButtonPicker from "@app/view/components/button-picker";

export function PlatformSelect(props: any) {
    const { platform, setPlatform } = props;

    const platformValues: string[] = ['pc', 'console'];
    const formatPlatform = (platform: string) => {
        if (platform === 'pc') return (
            <FontAwesome6
                name="computer-mouse" size={16} />
        );
        if (platform === 'console') return (
            <FontAwesome6
                name="gamepad" size={16} />
        );
        return <></>;
    };

    return (
        <ButtonPicker value={platform} values={platformValues} formatter={formatPlatform as any} onSelect={setPlatform} />
    );
}
