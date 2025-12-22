import { useQuery } from '@tanstack/react-query';
import { fetchCivVideos, fetchFeaturedVideos } from '@app/api/helper/api';
import { useLanguage } from '@app/queries/all';
import { uniqBy, orderBy } from 'lodash';
import { isAfter, subWeeks } from 'date-fns';

export const useCivVideo = (civ: string) => {
    return useQuery({
        enabled: !!civ,
        queryKey: ['video', civ],
        queryFn: async () => orderBy(await fetchCivVideos(civ), 'publishDate', 'desc')?.[0],
    });
};

export const useFeaturedVideos = () => {
    const language = useLanguage();

    return useQuery({
        enabled: !!language,
        queryKey: ['videos'],
        queryFn: async () =>
            uniqBy(
                orderBy(
                    (await fetchFeaturedVideos(language!)).filter((v) => isAfter(v.publishDate, subWeeks(new Date(), 1))).slice(0, 50),
                    'viewCount',
                    'desc'
                ),
                'author'
            ),
    });
};
