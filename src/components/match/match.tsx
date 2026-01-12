import { IMatchNew } from '@app/api/helper/api.types';
import { MarchCardSkeleton, MatchCard } from './match-card';

export interface MatchProps {
    match: IMatchNew;
    user?: number;
    highlightedUsers?: number[];
}

interface Props extends Omit<MatchProps, 'match'> {
    match?: MatchProps['match'] | null;
}

export const Match: React.FC<Props> = ({ match, ...props }) => {
    if (!match) {
        return <MarchCardSkeleton />;
    }

    return (
        <>
            <MatchCard match={match} {...props} clickable flat />
        </>
    );
};
