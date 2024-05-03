import { Card } from '@app/components/card';
import { Text } from '@app/components/text';
import tw from '@app/tailwind';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { startCase } from 'lodash';
import { useColorScheme } from 'nativewind';
import { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { BuildRating } from './build-rating';
import { getAgeIcon } from '../../..//helper/units';
import { IBuildOrder, sortBuildAges } from '../../../../../data/src/helper/builds';
import { genericCivIcon, getCivIconLocal } from '../../../helper/civs';
import { getDifficultyIcon } from '../../../helper/difficulties';
import { Tag } from '../tag';

const BuildCard: React.FC<IBuildOrder & { favorited?: boolean; toggleFavorite?: () => void; size?: 'small' | 'large' }> = ({
    favorited,
    toggleFavorite,
    size = 'large',
    ...build
}) => {
    const title = build.title.replace(build.civilization, '');
    const civIcon = getCivIconLocal(build.civilization) ?? genericCivIcon;
    const difficultyIcon = getDifficultyIcon(build.difficulty);
    const ages = sortBuildAges(Object.entries(build.pop));
    const { colorScheme } = useColorScheme();

    if (size === 'small') {
        return (
            <Card href={`/explore/build-orders/${build.id}`} direction="vertical" className="w-24 items-center justify-between gap-1">
                <View className="w-full items-center justify-center">
                    <Image source={{ uri: build.imageURL }} className="w-8 h-8" />
                    {civIcon ? <Image className="w-5 h-5 absolute top-0 left-0" source={civIcon} /> : null}
                </View>

                <Text variant="label-sm" numberOfLines={2} className="!leading-[14px] w-full" align="center">
                    {title}
                </Text>

                <BuildRating {...build} showCount={false} />
            </Card>
        );
    }

    const gradient =
        colorScheme === 'dark'
            ? [tw.color('blue-900/0') ?? 'black', tw.color('blue-900/100') ?? 'black']
            : [tw.color('white/0') ?? 'white', tw.color('white/100') ?? 'white'];

    return (
        <Card href={`/explore/build-orders/${build.id}`}>
            <Image source={{ uri: build.imageURL }} className="w-12 h-12" />

            <View className="flex-1 gap-0.5">
                <View className="flex-row justify-between items-center gap-2">
                    {civIcon ? <Image className="w-5 h-5" source={civIcon} /> : null}
                    <Text className="flex-1">{build.civilization}</Text>

                    <BuildRating {...build} />
                </View>

                <View className="flex-1 gap-1">
                    <Text variant="label-lg" numberOfLines={1}>
                        {title}
                    </Text>

                    <View className="flex-row gap-1">
                        <View className="flex-row gap-1 flex-1 overflow-hidden relative">
                            {ages.map(([ageName, agePop]) => (
                                <Tag key={ageName} icon={getAgeIcon(startCase(ageName.replace('Age', '')) as any)}>
                                    {ageName === 'feudalAge' ? '' : '+'}
                                    {agePop}
                                </Tag>
                            ))}
                            {build.attributes.map((attribute) => (
                                <Tag key={attribute}>{startCase(attribute)}</Tag>
                            ))}

                            <LinearGradient className="absolute top-0 right-0 h-full w-4" colors={gradient} start={[0, 0]} end={[1, 0]} />
                        </View>
                        <View className="flex-row gap-2 items-center">
                            {difficultyIcon && <Image className="w-6 h-6" source={difficultyIcon} />}

                            {toggleFavorite && (
                                <TouchableOpacity hitSlop={10} onPress={toggleFavorite}>
                                    <FontAwesome5 solid={favorited} name="heart" size={20} color="#ef4444" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </Card>
    );
};

export default memo(BuildCard);
