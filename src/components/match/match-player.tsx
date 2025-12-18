import { IMatchNew, IPlayerNew } from '@app/api/helper/api.types';
import { useLiveTwitchAccounts } from '@app/api/twitch';
import { getCivIcon } from '@app/helper/civs';
import { openLink } from '@app/helper/url';
import { BottomSheetProps } from '@app/view/bottom-sheet';
import { getLocalCivEnum } from '@nex/data';
import { appConfig } from '@nex/dataset';
import { Image } from '@/src/components/uniwind/image';
import { Link } from 'expo-router';
import { Platform, Pressable, TouchableOpacity, View } from 'react-native';

import { Icon } from '../icon';
import { Text } from '../text';
import TwitchBadge from '@app/view/components/badge/twitch-badge';
import React from 'react';
import { aoe2PlayerColors } from '@app/helper/colors';
import cn from 'classnames';
import { useResolveClassNames } from 'uniwind';

interface MatchPlayerProps {
    match: IMatchNew;
    player: IPlayerNew;
    highlight?: boolean;
    freeForAll?: boolean;
    canDownloadRec?: boolean;
    onClose?: BottomSheetProps['onClose'];
    className?: string
    colorClassName?: string
}

export const MatchPlayer: React.FC<MatchPlayerProps> = ({ match, player, highlight, freeForAll, canDownloadRec, onClose, className, colorClassName }) => {
    const downloadRec = async () => {
        const url = `https://aoe.ms/replay/?gameId=${match.matchId}&profileId=${player.profileId}`;
        await openLink(url);
    };
    const playerColor = aoe2PlayerColors[player.colorHex] ?? player.colorHex;
    const { liveTwitchAccounts } = useLiveTwitchAccounts();
    const twitch = player.socialTwitchChannel && liveTwitchAccounts?.find((twitch) => twitch.user_login === player.socialTwitchChannel);
    const styles = useResolveClassNames(className ?? '');

    return (
        <View className={cn('flex-row items-center gap-2', className)} style={appConfig.game === 'aoe2' && { borderColor: playerColor }}>
            {appConfig.game === 'aoe2' && (
                <View className={cn('w-5 h-5 items-center justify-center', colorClassName)} style={{ backgroundColor: playerColor }}>
                    <Text variant="header-xs" className="text-sm" color="text-white">
                        {player.color}
                    </Text>
                </View>
            )}

            <Link href={player.civ ? `/explore/civilizations/${getLocalCivEnum(player.civ)}` : '/'} disabled={!player.civ} asChild>
                <TouchableOpacity className={'flex-row flex-1 gap-1'} style={{ flexDirection: styles.flexDirection }} onPress={onClose}>
                    <Image className={appConfig.game === 'aoe2' ? 'w-5 h-5' : 'w-8 h-5'} source={getCivIcon(player)} contentFit="cover" />
                    <Text numberOfLines={1} variant={highlight ? 'label' : 'body'} className="flex-1">
                        {player.civName}
                    </Text>
                </TouchableOpacity>
            </Link>

            <Link href={`/matches/users/${player.profileId}`} asChild disabled={player.profileId === -1}>
                <TouchableOpacity className="flex-1 flex-row gap-1 items-center" onPress={onClose}>
                    <Text variant={highlight ? 'header-xs' : 'body'} numberOfLines={1}>
                        {player.name}
                    </Text>
                    {player.status === 'player' && player.verified && <Icon icon="check-circle" color="brand" size={12} style={{ width: 23 }} />}
                    {twitch && (
                        <View className="ml-2">
                            <TwitchBadge channelUrl={player?.socialTwitchChannelUrl} channel={player?.socialTwitchChannel} condensed />
                        </View>
                    )}
                    {player.status === 'player' && !player.verified && player.shared && (
                        <Icon icon="family" color="brand" size={12} style={{ width: 23 }} />
                    )}
                </TouchableOpacity>
            </Link>

            {Platform.OS === 'web' && appConfig.game === 'aoe2' && canDownloadRec && (
                <Pressable onPress={downloadRec}>
                    <Icon icon="cloud-download-alt" color="text-gray-500" />
                </Pressable>
            )}

            <Text variant={highlight ? 'label' : 'body'} className="w-10">
                {player.rating}
            </Text>

            {player.ratingDiff && (
                <Text variant="body" color={player.ratingDiff! > 0 ? 'text-green-500' : 'text-red-500'} className="text-center w-8">
                    {signed(player.ratingDiff!)}
                </Text>
            )}

            {match.finished && (
                <View className="w-5">
                    {player.won === true && (freeForAll || player.team != -1) && <Icon icon="crown" color="brand" />}
                    {player.won === false && (freeForAll || player.team != -1) && <Icon icon="skull" color="subtle" />}
                </View>
            )}
        </View>
    );
};

function signed(number: number) {
    if (number == null || number === 0) return '';
    return number > 0 ? '↑' + number : '↓' + Math.abs(number);
}
