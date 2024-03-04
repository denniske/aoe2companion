import { Post, useMedia } from '@app/utils/news';
import { Image } from 'expo-image';
import { decode } from 'html-entities';
import { useState } from 'react';
import { View } from 'react-native';

import { Card } from './card';
import { NewsPopup } from './news-popup';
import { Skeleton, SkeletonText } from './skeleton';
import { Text } from './text';

export const NewsCard: React.FC<Post> = (post) => {
    const { data } = useMedia(post.featured_media);
    const [visible, setVisible] = useState(false);

    if (!post.id) {
        return <NewsCardSkeleton />;
    }

    return (
        <Card onPress={() => setVisible(true)} direction="vertical" className="overflow-hidden w-56">
            <View className="-mx-2 -mt-3 mb-1">
                <Image source={{ uri: data?.source_url }} className="w-full" style={{ aspectRatio: 1.75 }} />
            </View>
            <Text variant="label" numberOfLines={2}>
                {decode(post.title.rendered)}
            </Text>

            <NewsPopup post={post} onClose={() => setVisible(false)} visible={visible} />
        </Card>
    );
};

export const NewsCardSkeleton = () => {
    return (
        <Card direction="vertical" className="overflow-hidden w-56">
            <View className="-mx-2 -mt-3 mb-1">
                <Skeleton className="w-full" style={{ aspectRatio: 1.75 }} />
            </View>

            <SkeletonText variant="label" numberOfLines={2} />
        </Card>
    );
};
