import { INewsResult } from '@app/api/helper/api.types';
import { FlatList } from '@app/components/flat-list';
import { NewsCard, NewsCardSkeleton } from '@app/components/news-card';
import { useNewsSuspense } from '@app/utils/news';
import React from 'react';

// Must be its own component so it renders *inside* <Suspense>: a suspense hook
// can't run in the component that hosts the boundary.
export const NewsSection = () => {
    const { data: news } = useNewsSuspense();
    return <NewsList news={news} />;
};

// Pure presentational list. Renders skeletons when `news` is undefined, so it
// doubles as the loading/error fallback for <QueryBoundary>.
export const NewsList = ({ news }: { news?: INewsResult }) => (
    <FlatList
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-4 px-4"
        className="-mx-4"
        horizontal
        data={news || Array<null>(5).fill(null)}
        renderItem={({ item }) => (item ? <NewsCard {...item} /> : <NewsCardSkeleton />)}
    />
);
