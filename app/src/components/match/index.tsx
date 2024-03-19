import { IMatchNew } from '@app/api/helper/api.types';
import { useState } from 'react';

import { MarchCardSkeleton, MatchCard } from './card';
import { MatchPopup } from './popup';

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
    const [popupVisible, setPopupVisible] = useState(false);

    if (!match) {
        return <MarchCardSkeleton />;
    }

    return (
        <>
            <MatchCard match={match} {...props} onPress={() => setPopupVisible(true)} />
            <MatchPopup match={match} {...props} isActive={popupVisible} onClose={() => setPopupVisible(false)} />
        </>
    );
};
