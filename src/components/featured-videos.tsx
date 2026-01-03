import { useFeaturedVideos } from '@app/utils/video';
import { Pressable, View } from 'react-native';
import { Text } from './text';
import { Image } from './uniwind/image';
import { Card } from './card';
import { useBreakpoints } from '@app/hooks/use-breakpoints';
import { useMemo } from 'react';
import { Link } from 'expo-router';
import { formatAgo } from '@nex/data';
import { orderBy } from 'lodash';

export const FeaturedVideos = () => {
    const { data: videos } = useFeaturedVideos();
    const { isSmall, isMedium, isLarge } = useBreakpoints();

    const count = useMemo(() => {
        if (isLarge) {
            return 6;
        } else if (isMedium) {
            return 4;
        } else if (isSmall) {
            return 3;
        }

        return 2;
    }, [isLarge, isMedium, isSmall]);

    return (
        <View className="gap-2">
            <Text variant="header-lg">Recent Videos</Text>

            <View className="flex flex-row gap-2.5">
                {orderBy(videos?.slice(0, count), 'publishDate', 'desc')?.map((video) => (
                    <Link
                        key={video.videoId}
                        className="flex-1 flex flex-col w-0 bg-white dark:bg-blue-900 hover:bg-gray-50 hover:dark:bg-blue-800 transition-colors rounded-lg"
                        target="_blank"
                        href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    >
                        <Card className="px-0! py-0! overflow-hidden flex-1 bg-transparent!" direction="vertical">
                            <Image source={{ uri: video.thumbnailUrl }} className="w-full aspect-video cursor-pointer" contentFit="cover" />

                            <View className="gap-0.5 px-3 pb-3 flex-1 justify-between">
                                <Text variant="header-xs" numberOfLines={2}>
                                    {video.title}
                                </Text>

                                <View className="flex flex-row gap-1 overflow-hidden">
                                    <Text variant="label-xs" className="flex-1" numberOfLines={1}>
                                        By {video.author}
                                    </Text>
                                    <Text variant="body-xs">{formatAgo(video.publishDate)}</Text>
                                </View>
                            </View>
                        </Card>
                    </Link>
                ))}
            </View>
        </View>
    );
};
