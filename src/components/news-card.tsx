import { Post, useMedia } from '@app/utils/news';
import { Image } from 'expo-image';
import { decode } from 'html-entities';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';

import { Card } from './card';
import { NewsPopup } from './news-popup';
import { Skeleton, SkeletonText } from './skeleton';
import { Text } from './text';
import { sortBy } from 'lodash';
import { openLink } from '@app/helper/url';
import { INews } from '@app/api/helper/api.types';

export const NewsCard: React.FC<INews> = (news) => {
    const [visible, setVisible] = useState(false);

    if (!news) {
        return <NewsCardSkeleton />;
    }

    const handlePress = () => {
        if (Platform.OS === 'web') {
            openLink(news.link);
        } else {
            setVisible(true);
        }
    };

    return (
        <Card onPress={handlePress} direction="vertical" className="overflow-hidden w-56">
            <View className="-mx-4 -mt-4 mb-1">
                <Image source={{ uri: news.featuredMediaUrl }} className="w-full" style={{ aspectRatio: 1.75 }} />
            </View>
            <Text variant="label" numberOfLines={2}>
                {decode(news.title)}
            </Text>

            <NewsPopup news={news} onClose={() => setVisible(false)} visible={visible} />
        </Card>
    );
};

export const NewsCardSkeleton = () => {
    return (
        <Card direction="vertical" className="overflow-hidden w-56">
            <View className="-mx-4 -mt-4 mb-1">
                <Skeleton className="w-full" style={{ aspectRatio: 1.75 }} />
            </View>
            <SkeletonText variant="label" numberOfLines={2} />
        </Card>
    );
};
