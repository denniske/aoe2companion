import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { appConfig } from '@nex/dataset';

export interface Post {
    id: number;
    date: string;
    date_gmt: string;
    guid: Rendered;
    modified: string;
    modified_gmt: string;
    slug: string;
    status: string;
    type: string;
    link: string;
    title: Rendered;
    content: Rendered;
    excerpt: Rendered;
    author: number;
    featured_media: number;
    comment_status: string;
    ping_status: string;
    sticky: boolean;
    template: string;
    format: string;
    categories?: number[] | null;
    game?: number[] | null;
    sub_categories?: null[] | null;
}
export interface Rendered {
    rendered: string;
}

export const useNews = (count: number) => {
    return useQuery({
        queryKey: ['news'],
        queryFn: async () => {
            const { data } = await axios.get(
                `https://www.ageofempires.com/wp-json/wp/v2/posts?per_page=${count}&game=${appConfig.game === 'aoe2de' ? 218 : 164}`
            );
            return data as Post[];
        },
        refetchOnWindowFocus: true,
    });
};

export interface Media {
    id: number;
    date: string;
    date_gmt: string;
    guid: Rendered;
    modified: string;
    modified_gmt: string;
    slug: string;
    status: string;
    type: string;
    link: string;
    title: Rendered;
    author: number;
    comment_status: string;
    ping_status: string;
    template: string;
    description: Rendered;
    caption: Rendered;
    alt_text: string;
    media_type: string;
    mime_type: string;
    media_details: MediaDetails;
    post: number;
    source_url: string;
}
export interface MediaDetails {
    width: number;
    height: number;
    file: string;
    filesize: number;
    sizes: Size[];
    image_meta: ImageMeta;
}
export interface Size {
    file: string;
    width: number;
    height: number;
    filesize: number;
    mime_type: string;
    source_url: string;
}
export interface ImageMeta {
    aperture: string;
    credit: string;
    camera: string;
    caption: string;
    created_timestamp: string;
    copyright: string;
    focal_length: string;
    iso: string;
    shutter_speed: string;
    title: string;
    orientation: string;
    keywords?: null[] | null;
}

export const useMedia = (id: number) => {
    return useQuery({
        enabled: !!id,
        queryKey: ['media', id],
        queryFn: async () => {
            const { data } = await axios.get(`https://www.ageofempires.com/wp-json/wp/v2/media/${id}`);
            return data as Media;
        },
    });
};
