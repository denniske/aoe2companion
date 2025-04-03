import { IMatchNew } from '@app/api/helper/api.types';
import { useEffect, useState } from 'react';

import { MarchCardSkeleton, MatchCard } from './card';
import { MatchPopup } from './popup';
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
    expanded?: boolean;
}

export const Match: React.FC<Props> = ({ match, expanded, ...props }) => {
    const [popupVisible, setPopupVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (expanded) {
            setTimeout(() => {
                setPopupVisible(true);
            }, 250);
        }
    }, [expanded]);

    const openMatch = () => {
        router.push(`/matches/single/${match?.matchId}`);
    };

    if (!match) {
        return <MarchCardSkeleton />;
    }

    return (
        <>
            <MatchCard match={match} {...props} onPress={() => openMatch()} />
            {/*<MatchCard match={match} {...props} onPress={() => setPopupVisible(true)} />*/}
            <MatchPopup match={match} {...props} isActive={popupVisible} onClose={() => setPopupVisible(false)} />
        </>
    );
};
