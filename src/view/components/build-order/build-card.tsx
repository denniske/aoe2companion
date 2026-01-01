import { Card } from '@app/components/card';
import { Text } from '@app/components/text';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from '@/src/components/uniwind/image';
import { startCase } from 'lodash';
import { TouchableOpacity, View } from 'react-native';
import { BuildRating } from './build-rating';
import { getAgeIcon } from '../../../helper/units';
import { getBuildIcon, IBuildOrder, sortBuildAges } from '@/data/src/helper/builds';
import { genericCivIcon, getCivIconLocal } from '../../../helper/civs';
import { getDifficultyIcon } from '../../../helper/difficulties';
import { Tag } from '../tag';
import React from 'react';
import cn from 'classnames';
import { Skeleton, SkeletonText } from '@app/components/skeleton';
import { UserLoginWrapper } from '@app/components/user-login-wrapper';

export const BuildCard: React.FC<
    IBuildOrder & { favorited?: boolean; toggleFavorite?: () => void; size?: 'small' | 'large'; className?: string }
> = ({ favorited, toggleFavorite, size = 'large', className, ...build }) => {
    const title = build.title.replace(build.civilization, '').trim();
    const civIcon = getCivIconLocal(build.civilization) ?? genericCivIcon;
    const difficultyIcon = getDifficultyIcon(build.difficulty);
    const ages = sortBuildAges(Object.entries(build.pop ?? {}));
    const icon = getBuildIcon(build.image);

    if (size === 'small') {
        return (
            <Card
                href={`/explore/build-orders/${build.id}`}
                direction="vertical"
                className={cn('w-24 md:w-36 items-center justify-between gap-1', className)}
            >
                <View className="w-full items-center justify-center">
                    {icon && <Image source={icon} className="w-8 h-8 md:w-12 md:h-12" />}
                    {civIcon ? <Image className="w-5 h-5 md:w-8 md:h-8 absolute top-0 left-0" source={civIcon} /> : null}
                </View>

                <View className="w-full h-8 items-center justify-center">
                    <Text variant="label-sm" numberOfLines={2} className="w-full" align="center">
                        {title}
                    </Text>
                </View>

                <BuildRating {...build} showCount={false} />
            </Card>
        );
    }

    return (
        <Card href={`/explore/build-orders/${build.id}`} className={className}>
            <Image source={icon} className="w-12 h-12" />

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
                        </View>
                        <View className="flex-row gap-2 items-center">
                            {difficultyIcon && <Image className="w-6 h-6" source={difficultyIcon} />}

                            {toggleFavorite && (
                                <UserLoginWrapper Component={TouchableOpacity} hitSlop={10} onPress={toggleFavorite}>
                                    <FontAwesome5 solid={favorited} name="heart" size={20} color="#ef4444" />
                                </UserLoginWrapper>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </Card>
    );
};

export const BuildSkeletonCard: React.FC<{ size?: 'small' | 'large'; className?: string }> = ({ size = 'large', className }) => {
    if (size === 'small') {
        return (
            <Card direction="vertical" className={cn('w-24 md:w-36 items-center justify-between gap-1', className)}>
                <View className="w-full items-center justify-center">
                    <Skeleton className="w-8 h-8 md:w-12 md:h-12" />
                </View>

                <SkeletonText variant="label-sm" numberOfLines={2} />

                <Skeleton className="w-20 h-3.5" />
            </Card>
        );
    }

    // Large skeleton not needed yet
    return null;
};
