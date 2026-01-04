import { ILeaderboardPlayer, ILobbiesMatch } from '@app/api/helper/api.types';
import { Icon } from '@app/components/icon';
import { clone, reverse } from 'lodash';
import { MatchCard } from './match-card';

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
}: {
    player: ILeaderboardPlayer;
    playerNames: Record<string, { name: string; icon?: string }>;
    match?: ILobbiesMatch;
    last10MatchesWon?: Array<boolean | null>;
}) => {
    const last5MatchesWon = reverse(clone((last10MatchesWon ?? player.last10MatchesWon)?.filter((_, i) => i < 5) ?? []));

    return (
        <div className="inline-flex gap-1.5">
            {last5MatchesWon.map((won, index) => (
                <div
                    key={index}
                    className={`group w-4 h-4 relative flex items-center justify-center rounded-full text-md ${
                        won === null
                            ? `bg-gold-500 animate-pulse ${!!match ? 'hover:animate-none cursor-pointer' : ''}`
                            : won
                            ? 'bg-green-500'
                            : 'bg-red-500'
                    }`}
                >
                    {won ? <Icon icon="check" color="white" size={10} /> : won === false && <Icon icon="times" color="white" size={10} />}

                    {!!match && won === null && (
                        <div className="absolute top-12 left-1/2 -translate-x-1/2 mx-auto scale-0 bg-blue-800 rounded-lg border-gray-800 px-3 py-2 group-hover:scale-100 z-10 flex flex-row w-96 gap-3 items-center text-sm shadow-2xl transition-transform">
                            <div className="h-0 w-0 border-x-8 border-x-transparent border-b-8 border-b-blue-800 absolute -top-2 mx-auto left-0 right-0"></div>
                            <MatchCard userId={player.profileId} match={match} playerNames={playerNames} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
