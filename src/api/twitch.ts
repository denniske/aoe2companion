import { getHost } from '@nex/data';
import { appConfig } from '@nex/dataset';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { ITwitchChannel } from './following';

export const useLiveTwitchAccounts = () => {
    const { data: liveTwitchAccounts, ...rest } = useQuery({
        queryKey: ['twitch', 'all'],
        queryFn: async () => {
            const url = getHost('aoe2companion-api') + `twitch/live?game=${appConfig.game === 'aoe2' ? '13389' : '498482'}`;

            const { data } = await axios.get(url);
            return (Array.isArray(data) ? data : []) as ITwitchChannel[];
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
    });

    return { ...rest, liveTwitchAccounts };
};
