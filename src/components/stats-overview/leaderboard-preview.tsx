import { fetchLeaderboard } from '@app/api/helper/api';
import { Button } from '@app/components/button';
import { Card } from '@app/components/card';
import { LeaderboardRow, useLeaderboardRowStyles } from '@app/components/leaderboard/leaderboard-row';
import { CountrySelect, isCountry } from '@app/components/select/country-select';
import { LeaderboardOfficialSelect } from '@app/components/select/leaderboard-official-select';
import { Text } from '@app/components/text';
import { leaderboardsByType } from '@app/helper/leaderboard';
import { usePluralForms, useTranslation } from '@app/helper/translate';
import { useAuthProfileId, useLanguage, useLeaderboards } from '@app/queries/all';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';

const PREVIEW_SIZE = 5;

// The top of the leaderboard, rendered with the leaderboard screen's own row so the
// columns match what "Show full leaderboard" opens. Below md the card runs edge to
// edge, so the rows get the full window width exactly like on that screen; inside
// the page padding the name column was squeezed down to a few characters.
export const LeaderboardPreview: React.FC<{ className?: string }> = ({ className }) => {
    const getTranslation = useTranslation();
    const language = useLanguage();
    const authProfileId = useAuthProfileId();

    const { data: allLeaderboards } = useLeaderboards();
    const leaderboards = useMemo(() => allLeaderboards?.filter((l) => l.official), [allLeaderboards]);
    const [selectedLeaderboardId, setLeaderboardId] = useState<string | null>(null);
    const leaderboardId = selectedLeaderboardId ?? leaderboardsByType(leaderboards ?? [], 'pc')?.[0]?.leaderboardId;
    const [leaderboardCountry, setLeaderboardCountry] = useState<string | null>(null);

    // "following" needs the followed ids; for the preview it falls back to the world list.
    const showCountryRank = isCountry(leaderboardCountry);
    const params = showCountryRank
        ? { country: leaderboardCountry! }
        : leaderboardCountry?.startsWith('Clan ')
          ? { clan: leaderboardCountry.replace('Clan ', '') }
          : {};

    const { data } = useQuery({
        enabled: !!language && !!leaderboardId,
        queryKey: ['leaderboard-preview', language, leaderboardId, params],
        queryFn: () => fetchLeaderboard({ language: language!, leaderboardId: leaderboardId!, perPage: PREVIEW_SIZE, ...params }),
    });

    const rowStyles = useLeaderboardRowStyles();
    const gamesLabel = usePluralForms('leaderboard.games');
    const { width: windowWidth } = useWindowDimensions();
    const players = data?.players;
    // Same sizing rule as the leaderboard screen: ten pixels per digit plus the '#'.
    const rankWidth = Math.max(43, ...(players ?? []).map((p) => ((showCountryRank ? p.rankCountry : p.rank) ?? 0).toFixed(0).length * 10 + 10));

    const fullHref = `/statistics/leaderboard?leaderboard=${leaderboardId ?? ''}${showCountryRank ? `&country=${leaderboardCountry}` : ''}`;

    return (
        <Card direction="vertical" className={`-mx-4 rounded-none border-x-0 md:mx-0 md:rounded-lg md:border-x ${className ?? ''}`}>
            <View className="flex-row flex-wrap items-center justify-between gap-2">
                <Text variant="label-lg">{getTranslation('leaderboards.title')}</Text>
                <View className="flex-row gap-2 w-full md:w-auto">
                    <View className="flex-1 md:flex-none">
                        {leaderboardId && <LeaderboardOfficialSelect leaderboardId={leaderboardId} onLeaderboardIdChange={setLeaderboardId} />}
                    </View>
                    <View className="flex-1 md:flex-none">
                        <CountrySelect country={leaderboardCountry} onCountryChange={setLeaderboardCountry} />
                    </View>
                </View>
            </View>
            <View className="-mx-4">
                {Array.from({ length: PREVIEW_SIZE }, (_, i) => (
                    <View key={i} style={{ height: 45 }}>
                        <LeaderboardRow
                            player={players?.[i]}
                            i={i}
                            showCountryRank={showCountryRank}
                            showGames={windowWidth >= 360}
                            gamesLabel={gamesLabel}
                            authProfileId={authProfileId}
                            rankWidth={rankWidth}
                            styles={rowStyles}
                            onSelect={(player) => router.push(`/players/${player.profileId}`)}
                        />
                    </View>
                ))}
            </View>
            <Button href={fullHref as any} align="center">
                Show full leaderboard
            </Button>
        </Card>
    );
};
