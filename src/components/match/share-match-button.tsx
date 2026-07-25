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
        // Capability checks and the payload are built outside the try: logical and
        // ternary expressions inside a try/catch make React Compiler bail out on
        // the whole component. Plain `if` statements inside it are fine.
        const hasNavigator = typeof navigator !== 'undefined';
        const canWebShare = hasNavigator && !!navigator.share;
        const canWriteClipboard = hasNavigator && !!navigator.clipboard;
        const sharePayload = Platform.OS === 'ios' ? { url } : { message: url };

        try {
            if (Platform.OS === 'web') {
                if (canWebShare) {
                    await navigator.share({ url });
                } else if (canWriteClipboard) {
                    await navigator.clipboard.writeText(url);
                }
                return;
            }
            await Share.share(sharePayload);
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
