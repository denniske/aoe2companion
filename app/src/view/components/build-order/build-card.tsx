import { Card } from '@app/components/card';
import { Text } from '@app/components/text';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { startCase } from 'lodash';
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

    if (size === 'small') {
        return (
            <Card href={`/explore/build-orders/${build.id}`} direction="vertical" className="w-24 items-center justify-between g-1">
                <View className="w-full items-center justify-center">
                    <Image source={{ uri: build.imageURL }} className="w-8 h-8" />
                    {civIcon ? <Image className="w-5 h-5 absolute top-0 left-0" source={civIcon} /> : null}
                </View>

                <Text variant="label-sm" numberOfLines={2} className="leading-[14px] w-full" align="center">
                    {title}
                </Text>

                <BuildRating {...build} showCount={false} />
            </Card>
        );
    }

    return (
        <Card href={`/explore/build-orders/${build.id}`}>
            <Image source={{ uri: build.imageURL }} className="w-12 h-12" />

            <View className="flex-1 g-0.5">
                <View className="flex-row justify-between items-center g-2">
                    {civIcon ? <Image className="w-5 h-5" source={civIcon} /> : null}
                    <Text className="flex-1">{build.civilization}</Text>

                    <BuildRating {...build} />
                </View>

                <View className="flex-1 g-1">
                    <Text variant="label-lg" numberOfLines={1}>
                        {title}
                    </Text>

                    <View className="flex-row g-1">
                        {ages.map(([ageName, agePop]) => (
                            <Tag key={ageName} icon={getAgeIcon(startCase(ageName.replace('Age', '')) as any)}>
                                {ageName === 'feudalAge' ? '' : '+'}
                                {agePop}
                            </Tag>
                        ))}
                        {build.attributes.map((attribute) => (
                            <Tag key={attribute}>{startCase(attribute)}</Tag>
                        ))}
                    </View>
                </View>

                {difficultyIcon && (
                    <View className="absolute bottom-0 right-0 flex-row g-2 items-center">
                        <Image className="w-6 h-6" source={difficultyIcon} />
                        {toggleFavorite && (
                            <TouchableOpacity hitSlop={10} onPress={toggleFavorite}>
                                <FontAwesome5 solid={favorited} name="heart" size={20} color="#ef4444" />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </Card>
    );
};

export default memo(BuildCard);
