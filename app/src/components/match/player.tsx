import { IMatchNew, IPlayerNew } from '@app/api/helper/api.types';
import { Platform, Pressable, View } from 'react-native';
import { Icon } from '../icon';
import { Text } from '../text';
import { appConfig } from '@nex/dataset';
import { isVerifiedPlayer } from '@nex/data';
import { openLink } from '@app/helper/url';
import { getCivIcon } from '@app/helper/civs';
import { Image } from 'expo-image';
import { Link } from 'expo-router';

interface MatchPlayerProps {
    match: IMatchNew;
    player: IPlayerNew;
    highlight?: boolean;
    freeForAll?: boolean;
    canDownloadRec?: boolean;
}

export const MatchPlayer: React.FC<MatchPlayerProps> = ({ match, player, highlight, freeForAll, canDownloadRec }) => {
    const downloadRec = async () => {
        const url = `https://aoe.ms/replay/?gameId=${match.matchId}&profileId=${player.profileId}`;
        await openLink(url);
    };

    return (
        <View className="flex-row items-center gap-2">
            <View className="w-5">
                {player.won === true && (freeForAll || player.team != -1) && <Icon icon="crown" color="brand" />}
                {player.won === false && (freeForAll || player.team != -1) && <Icon icon="crown" color="text-gray-500" />}
            </View>
            {appConfig.game === 'aoe2de' && (
                <View className="w-5 h-5 items-center justify-center" style={{ backgroundColor: player.colorHex }}>
                    <Text variant="header-sm" color="text-white">
                        {player.color}
                    </Text>
                </View>
            )}

            <Text variant="label">{player.rating}</Text>

            <Link href={`/matches/user/${player.profileId}`} asChild>
                <Pressable className="flex-1">
                    <Text variant="label" numberOfLines={1}>
                        {player.name}
                    </Text>
                    {player.status === 0 && isVerifiedPlayer(player.profileId) && <Icon icon="check-circle" color="brand" />}
                </Pressable>
            </Link>

            <Text variant="body" color={player.ratingDiff > 0 ? 'text-green-500' : 'text-red-500'} className="text-center w-8">
                {signed(player.ratingDiff)}
            </Text>

            {Platform.OS === 'web' && appConfig.game === 'aoe2de' && canDownloadRec && (
                <Pressable onPress={downloadRec}>
                    <Icon icon="cloud-download-alt" color="text-gray-500" />
                </Pressable>
            )}

            <View className="flex-row flex-1">
                <Image className="w-5 h-5" source={getCivIcon(player)} />
                <Text numberOfLines={1} variant="label">
                    {player.civName}
                </Text>
            </View>
        </View>
    );
};

function signed(number: number) {
    if (number == null || number === 0) return '';
    return number > 0 ? '↑' + number : '↓' + Math.abs(number);
}
