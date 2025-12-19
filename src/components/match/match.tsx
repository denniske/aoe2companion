import { IMatchNew } from '@app/api/helper/api.types';

import { MarchCardSkeleton, MatchCard } from './match-card';
import { useRouter } from 'expo-router';

export interface MatchProps {
    match: IMatchNew;
    expanded?: boolean;
    user?: number;
    highlightedUsers?: number[];
    showLiveActivity?: boolean;
}

interface Props extends Omit<MatchProps, 'match'> {
    match?: MatchProps['match'] | null;
}

export const Match: React.FC<Props> = ({ match, ...props }) => {
    const router = useRouter();

    const openMatch = () => {
        router.push(`/matches/${match?.matchId}`);
    };

    if (!match) {
        return <MarchCardSkeleton />;
    }

    return (
        <>
            <MatchCard match={match} {...props} onPress={() => openMatch()} flat={true} />
        </>
    );
};
