import { ILeaderboardPlayer } from '@app/api/helper/api.types';
import { Icon } from '@app/components/icon';
import { clone, reverse } from 'lodash';

export const formatStreak = (streak: number) => {
    const streakText = streak > 0 ? 'Win' : 'Loss';

    return `${Math.abs(streak)} ${streakText} Streak`;
};

export const formatStreakShort = (streak: number) =>
    streak > 0 ? `+${streak}` : `${streak}`;

export const LastFiveMatches = ({ player }: { player: ILeaderboardPlayer }) => {
    const last5MatchesWon = reverse(
        clone(player.last10MatchesWon?.filter((_, i) => i < 5) ?? [])
    );

    return (
        <div className="inline-flex gap-1.5">
            {last5MatchesWon.map((won, index) => (
                <div
                    key={index}
                    className={`w-4 h-4 relative flex items-center justify-center rounded-full text-md ${
                        won === null ? 'bg-gold-500 animate-pulse' : won ? 'bg-green-500' : 'bg-red-500'
                    }`}
                >
                    {won ? (
                        <Icon
                            icon="check"
                            color="white"
                            size={10}
                        />
                    ) : won === false && (
                        <Icon
                            icon="times"
                            color="white"
                            size={10}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};
