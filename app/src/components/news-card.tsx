import { Post, useMedia } from '@app/utils/news';
import { Image } from 'expo-image';
import { decode } from 'html-entities';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Card } from './card';
import { NewsPopup } from './news-popup';
import { Skeleton, SkeletonText } from './skeleton';
import { Text } from './text';
import { sortBy } from 'lodash';

export const NewsCard: React.FC<Post> = (post) => {
    const { data } = useMedia(post.featured_media);
    const [visible, setVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();

    useEffect(() => {
        if (data) {
            const validSizes = Object.values(data.media_details?.sizes ?? {}).filter((size) => size.width > 500);
            if (validSizes?.length > 0) {
                const orderedSizes = sortBy(validSizes, s => s.filesize);
                setImageUrl(orderedSizes[0]?.source_url);
            } else {
                setImageUrl(data.source_url);
            }
        }
    }, [data]);

    if (!post.id || !imageUrl) {
        return <NewsCardSkeleton />;
    }

    return (
        <Card onPress={() => setVisible(true)} direction="vertical" className="overflow-hidden w-56">
            <View className="-mx-2 -mt-3 mb-1">
                <Image source={{ uri: imageUrl }} className="w-full" style={{ aspectRatio: 1.75 }} />
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
