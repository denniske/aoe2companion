import { IMatchNew } from '@app/api/helper/api.types';
import { MatchCard } from './card';
import { MatchPopup } from './popup';
import { useState } from 'react';

export interface MatchProps {
    match: IMatchNew;
    expanded?: boolean;
    user?: number;
    highlightedUsers?: number[];
    showLiveActivity?: boolean;
}

export const Match: React.FC<MatchProps> = (props) => {
    const [popupVisible, setPopupVisible] = useState(false);

    return (
        <>
            <MatchCard {...props} onPress={() => setPopupVisible(true)} />
            <MatchPopup {...props} isActive={popupVisible} onClose={() => setPopupVisible(false)} />
        </>
    );
};
