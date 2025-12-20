import { useQuery } from '@tanstack/react-query';
import { fetchVideos } from '@app/api/helper/api';
import orderBy from 'lodash/orderBy';

export const useVideo = (civ: string) => {
    return useQuery({
        enabled: !!civ,
        queryKey: ['video', civ],
        queryFn: async () => orderBy(await fetchVideos(civ), 'publishDate', 'desc')?.[0],
    });
};


export const useFeaturedVideos = () => {
    return useQuery({
        queryKey: ['videos'],
        queryFn: async () => orderBy((await fetchVideos()).slice(0, 10), 'viewCount', 'desc')
    });
};
