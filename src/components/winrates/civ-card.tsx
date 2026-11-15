import { WinrateCiv } from '@app/api/winrates';
import { getCivIconLocal } from '@app/helper/civs';
import { useSelector } from '@app/redux/reducer';
import { Civ, getCivNameById } from '@nex/data';
import { Image } from '@/src/components/uniwind/image';
import { capitalize } from 'lodash';
import { View } from 'react-native';

import { Card } from '../card';
import { ProgressBar } from '../progress-bar';
import { Skeleton, SkeletonText } from '../skeleton';
import { Text } from '../text';
import { useAccountData } from '@app/queries/all';
import { useTranslation } from '@app/helper/translate';

/**
 * All the card reads: our /api/meta civ stats and the Red Bull overlay both map into this.
 * civName and civImageUrl come with the meta API and work for both games; without them
 * (the Red Bull overlay) the card falls back to aoe2's bundled icon and name lookup.
 */
export type CivWinrateCardData = Pick<WinrateCiv, 'civ_name' | 'win_rate' | 'play_rate' | 'num_games'> & {
    civName?: string;
    civImageUrl?: string;
};

export const CivWinrateCard = ({ civ, maxPlayrate = 8, clickable = true }: { civ?: CivWinrateCardData, maxPlayrate?: number, clickable?: boolean }) => {
    const getTranslation = useTranslation();
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
        <Card direction="vertical" className="px-4 gap-2 mx-4" href={clickable ? `/statistics/winrates/${civ.civ_name}` : undefined}>
            <View className="flex-row gap-4">
                <Image
                    className="w-12 h-12"
                    source={civ.civImageUrl ? { uri: civ.civImageUrl } : getCivIconLocal(capitalize(civ.civ_name) as Civ)}
                    contentFit="contain"
                />

                <View className="flex-1 gap-2">
                    <ProgressBar label={getTranslation('winrates.winrate')} percent={civ.win_rate * 100} status={civ.win_rate >= 0.5 ? 'positive' : 'negative'} />
                    <ProgressBar label={getTranslation('winrates.playrate')} percent={civ.play_rate * 100} max={maxPlayrate} />
                </View>
            </View>

            <View className="flex-row justify-between">
                <Text variant="label-lg" numberOfLines={1}>
                    {civ.civName ?? getCivNameById(capitalize(civ.civ_name) as Civ)}
                </Text>
                <Text>{getTranslation('winrates.games', { games: civ.num_games.toLocaleString(language), count: civ.num_games })}</Text>
            </View>
        </Card>
    );
};
