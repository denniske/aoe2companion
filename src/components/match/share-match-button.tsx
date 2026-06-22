import React from 'react';
import { Platform, Share, TouchableOpacity } from 'react-native';
import { Icon } from '@app/components/icon';
import { faArrowUpFromSquare } from '@fortawesome/sharp-regular-svg-icons';
import { appConfig } from '@nex/dataset';

interface ShareMatchButtonProps {
    profileId: number;
    matchId: number;
}

export function ShareMatchButton({ profileId, matchId }: ShareMatchButtonProps) {
    const url = `https://www.${appConfig.hostAoeCompanion}/players/${profileId}/matches/${matchId}`;

    const onPress = async () => {
        try {
            if (Platform.OS === 'web') {
                if (typeof navigator !== 'undefined' && navigator.share) {
                    await navigator.share({ url });
                } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    await navigator.clipboard.writeText(url);
                }
                return;
            }
            await Share.share(Platform.OS === 'ios' ? { url } : { message: url });
        } catch {
            // user cancelled or sharing unavailable
        }
    };

    return (
        <TouchableOpacity onPress={onPress} hitSlop={10}>
            <Icon icon={faArrowUpFromSquare} size={20} color="foreground" />
        </TouchableOpacity>
    );
}
