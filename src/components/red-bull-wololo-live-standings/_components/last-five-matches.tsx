import { ILeaderboardPlayer, ILobbiesMatch } from '@app/api/helper/api.types';
import { Icon, IconName } from '@app/components/icon';
import { clone, reverse } from 'lodash';
import { MatchCard } from './match-card';
import { useMemo } from 'react';

export const formatStreak = (streak: number) => {
    const streakText = streak > 0 ? 'Win' : 'Loss';

    return `${Math.abs(streak)} ${streakText} Streak`;
};

export const formatStreakShort = (streak: number) => (streak > 0 ? `+${streak}` : `${streak}`);

export const LastFiveMatches = ({
    player,
    playerNames,
    match,
    last10MatchesWon,
    isPastDeadline,
}: {
    player: ILeaderboardPlayer;
    playerNames: Record<string, { name: string; icon?: string }>;
    match?: ILobbiesMatch;
    last10MatchesWon?: Array<boolean | null>;
    isPastDeadline?: boolean;
}) => {
    const last5MatchesWon = reverse(clone((last10MatchesWon ?? player.last10MatchesWon)?.filter((_, i) => i < 5) ?? []));

    return (
        <div className="inline-flex gap-1.5">
            {last5MatchesWon.map((won, index) => {
                let statusClass: string = '';
                let icon: IconName | null = null

                if (isPastDeadline && won === null) {
                    statusClass = 'bg-blue-500';
                    icon = 'pause';
                } else if (won === null) {
                    statusClass = `bg-gold-500 animate-pulse ${!!match ? '2xl:hover:animate-none 2xl:cursor-pointer' : ''}`;
                } else if (won) {
                    icon = 'check'
                    statusClass = 'bg-green-500'
                } else {
                    icon = 'times';
                    statusClass = 'bg-red-500'
                }
                
                return (
                <div
                    key={index}
                    className={`group w-4 h-4 relative flex items-center justify-center rounded-full text-md ${statusClass}`}
                >
                    {icon && <Icon icon={icon} color="white" size={10} />}

                    {!!match && won === null && (
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 mx-auto scale-0 bg-blue-800 rounded-lg border-gray-800 px-3 py-2 2xl:group-hover:scale-100 z-10 flex flex-row w-96 gap-3 items-center text-sm shadow-2xl transition-transform invisible group-hover:visible">
                            <div className="h-0 w-0 border-x-8 border-x-transparent border-b-8 border-b-blue-800 absolute -top-2 mx-auto left-0 right-0"></div>
                            <MatchCard userId={player.profileId} match={match} playerNames={playerNames} />
                        </div>
                    )}
                </div>
            )})}
        </div>
    );
};
