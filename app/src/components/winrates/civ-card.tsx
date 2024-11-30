import { WinrateCiv } from '@app/api/winrates';
import { getCivIconLocal } from '@app/helper/civs';
import { useSelector } from '@app/redux/reducer';
import { Civ, getCivNameById } from '@nex/data';
import { Image } from 'expo-image';
import { capitalize } from 'lodash';
import { View } from 'react-native';

import { Card } from '../card';
import { ProgressBar } from '../progress-bar';
import { Skeleton, SkeletonText } from '../skeleton';
import { Text } from '../text';
import { useAccountData } from '@app/queries/all';

export const CivWinrateCard = ({ civ }: { civ?: WinrateCiv }) => {
    const language = useAccountData(data => data.language);

    if (!civ) {
        return (
            <Card direction="vertical" className="px-4 gap-2 mx-4">
                <View className="flex-row gap-4">
                    <Skeleton className="w-12 h-12" style={{ aspectRatio: 1.75 }} />

                    <View className="flex-1 gap-2">
                        <View>
                            <SkeletonText variant="label-xs" />
                            <Skeleton className="h-5" />
                        </View>

                        <View>
                            <SkeletonText variant="label-xs" />
                            <Skeleton className="h-5" />
                        </View>
                    </View>
                </View>

                <View className="flex-row justify-between">
                    <SkeletonText variant="label-lg" numberOfLines={1} className="w-24" />
                    <SkeletonText className="w-24" />
                </View>
            </Card>
        );
    }

    return (
        <Card direction="vertical" className="px-4 gap-2 mx-4" href={`/statistics/winrates/${capitalize(civ.civ_name)}`}>
            <View className="flex-row gap-4">
                <Image className="w-12 h-12" source={getCivIconLocal(capitalize(civ.civ_name) as Civ)} contentFit="contain" />

                <View className="flex-1 gap-2">
                    <ProgressBar label="Win Rate" percent={civ.win_rate * 100} status={civ.win_rate >= 0.5 ? 'positive' : 'negative'} />
                    <ProgressBar label="Play Rate" percent={civ.play_rate * 100} max={8} />
                </View>
            </View>

            <View className="flex-row justify-between">
                <Text variant="label-lg" numberOfLines={1}>
                    {getCivNameById(capitalize(civ.civ_name) as Civ)}
                </Text>
                <Text>Picks: {civ.num_games.toLocaleString(language)}</Text>
            </View>
        </Card>
    );
};
