import { IMatchNew, IPlayerNew } from '@app/api/helper/api.types';
import { getCivIcon } from '@app/helper/civs';
import { openLink } from '@app/helper/url';
import { BottomSheetProps } from '@app/view/bottom-sheet';
import { isVerifiedPlayer } from '@nex/data';
import { appConfig } from '@nex/dataset';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Platform, Pressable, TouchableOpacity, View } from 'react-native';

import { Icon } from '../icon';
import { Text } from '../text';

const playerColors: Record<string, string> = {
    '#405BFF': '#4B4AC8',
    '#FF0000': '#C72321',
    '#00FF00': '#24C821',
    '#FFFF00': '#C8C817',
    '#00FFFF': '#22AFB0',
    '#FF57B3': '#C723C8',
    '#797979': '#797979',
    '#FF9600': '#C78031',
};

interface MatchPlayerProps {
    match: IMatchNew;
    player: IPlayerNew;
    highlight?: boolean;
    freeForAll?: boolean;
    canDownloadRec?: boolean;
    onClose: BottomSheetProps['onClose'];
}

export const MatchPlayer: React.FC<MatchPlayerProps> = ({ match, player, highlight, freeForAll, canDownloadRec, onClose }) => {
    const downloadRec = async () => {
        const url = `https://aoe.ms/replay/?gameId=${match.matchId}&profileId=${player.profileId}`;
        await openLink(url);
    };
    const playerColor = playerColors[player.colorHex] ?? player.colorHex;

    return (
        <View className="flex-row items-center gap-2">
            <View className="w-5">
                {player.won === true && (freeForAll || player.team != -1) && <Icon icon="crown" color="brand" />}
                {player.won === false && (freeForAll || player.team != -1) && <Icon icon="skull" color="text-gray-500" />}
            </View>
            {appConfig.game === 'aoe2de' && (
                <View className="w-5 h-5 items-center justify-center" style={{ backgroundColor: playerColor }}>
                    <Text variant="title" className="text-sm" color="text-white">
                        {player.color}
                    </Text>
                </View>
            )}

            <Text variant="label" className="w-10">
                {player.rating}
            </Text>

            <Link href={`/matches/users/${player.profileId}`} asChild>
                <TouchableOpacity className="flex-1 flex-row gap-1 items-center" onPress={onClose}>
                    <Text variant="label" numberOfLines={1}>
                        {player.name}
                    </Text>
                    {player.status === 0 && isVerifiedPlayer(player.profileId) && <Icon icon="check-circle" color="brand" size={12} />}
                </TouchableOpacity>
            </Link>

            <Text variant="body" color={player.ratingDiff > 0 ? 'text-green-500' : 'text-red-500'} className="text-center w-8">
                {signed(player.ratingDiff)}
            </Text>

            {Platform.OS === 'web' && appConfig.game === 'aoe2de' && canDownloadRec && (
                <Pressable onPress={downloadRec}>
                    <Icon icon="cloud-download-alt" color="text-gray-500" />
                </Pressable>
            )}

            <Link href={`/explore/civilizations/${player.civName}`} asChild>
                <TouchableOpacity className="flex-row flex-1 gap-1" onPress={onClose}>
                    <Image className={appConfig.game === 'aoe2de' ? 'w-5 h-5' : 'w-8 h-5'} source={getCivIcon(player)} contentFit="contain" />
                    <Text numberOfLines={1} variant="label" className="flex-1">
                        {player.civName}
                    </Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
};

function signed(number: number) {
    if (number == null || number === 0) return '';
    return number > 0 ? '↑' + number : '↓' + Math.abs(number);
}
