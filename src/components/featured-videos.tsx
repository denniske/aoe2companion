import { useFeaturedVideos } from '@app/utils/video';
import { Pressable, View } from 'react-native';
import { Text } from './text';
import { Link } from 'expo-router';
import { Image } from './uniwind/image';

export const FeaturedVideos = () => {
    const { data: videos } = useFeaturedVideos();
    return (
        <View>
            <Text variant="header-lg">Recent Videos</Text>

            <View className="grid grid-cols-4 gap-4">
                {videos?.slice(0, 4)?.map((video) => (
                    <Link href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" asChild>
                        <Pressable>
                            <View className="py-4 gap-0.5">
                                <Image source={{ uri: video.thumbnailUrl }} className="w-full aspect-video rounded-lg cursor-pointer" />

                                <Text variant="header-lg">{video.title}</Text>
                                <Text variant="label-sm">By {video.author}</Text>
                            </View>
                        </Pressable>
                    </Link>
                ))}
            </View>
        </View>
    );
};
