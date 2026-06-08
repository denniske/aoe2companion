import { Link } from 'expo-router';
import { Icon } from '@app/components/icon';
import { faCrown, faFistRaised, faPlug } from '@fortawesome/sharp-solid-svg-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { IMatchesMatchPlayer2 } from '../../api/helper/api.types';
import { useAppTheme } from '../../theming';
import { MyText } from '../../view/components/my-text';
import { appConfig } from '@nex/dataset';
import { Text } from '@app/components/text';
import { aoe2PlayerColors } from '@app/helper/colors';

interface IPlayerProps {
    player: IMatchesMatchPlayer2 | null;
}

export function LivePlayer({ player }: IPlayerProps) {
    const theme = useAppTheme();

    if (player == null) {
        return (
            <View className="flex-row items-center gap-2">
                {appConfig.game === 'aoe2' && <View className="w-5 h-5"></View>}
                <View className="flex-1" />
                <View className="flex-3" />
                <View className="flex-1 items-end">
                    <Icon icon={faFistRaised} size={14} style={{ color: theme.textNoteColor }} />
                </View>
                <View className="flex-1 items-end">
                    <Icon icon={faCrown} size={14} style={{ color: theme.textNoteColor }} />
                </View>
                <View className="flex-1 items-end">
                    <Icon icon={faPlug} size={14} style={{ color: theme.textNoteColor }} />
                </View>
            </View>
        );
    }

    const playerColor = aoe2PlayerColors[player.colorHex] ?? player.colorHex;

    return (
        <Link asChild href={`/players/${player.profileId}`}>
            <TouchableOpacity className="flex-row items-center gap-2">
                {appConfig.game === 'aoe2' && (
                    <View className="w-5 h-5 items-center justify-center" style={{ backgroundColor: playerColor }}>
                        <Text variant="header-xs" className="text-sm" color="text-white">
                            {player.color}
                        </Text>
                    </View>
                )}
                <MyText className="flex-1">{player.rating}</MyText>
                <MyText className="flex-3" numberOfLines={1}>
                    {player.name}
                </MyText>
                <MyText className="flex-1 text-right">{!!player.games && player.games + ''}</MyText>
                <MyText className="flex-1 text-right">
                    {!!player.games && !!player.wins && ((player.wins / player.games) * 100).toFixed(0) + ' %'}
                </MyText>
                <MyText className="flex-1 text-right">
                    {!!player.games && !!player.drops && ((player.drops / player.games) * 100).toFixed(0) + ' %'}
                </MyText>
            </TouchableOpacity>
        </Link>
    );
}
