import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from '@app/helper/translate';
import { useLeaderboards, useProfilesByClan } from '@app/queries/all';
import { LoadingScreen } from '@app/components/loading-screen';
import NotFound from '../+not-found';
import PlayerList from '@app/view/components/player-list';
import { View } from 'react-native';
import { containerClassName } from '@app/styles';
import cn from 'classnames';
import { Text } from '@app/components/text';
import { ScrollView } from '@app/components/scroll-view';
import { LeaderboardSnapshot } from '@app/components/leaderboard-snapshot';
import { LeaderboardsSelect } from '@app/components/select/leaderboards-select';
import { useEffect, useState } from 'react';
import { Card } from '@app/components/card';
import { ILeaderboardDef } from '@app/api/helper/api.types';
import ButtonPicker from '@app/view/components/button-picker';
import { LeaderboardSelect } from '@app/components/select/leaderboard-select';

const MAX_CLAN_PLAYERS = 100;

type ClanPageParams = {
    clan: string;
};

export default function SearchPage() {
    const getTranslation = useTranslation();
    const { clan } = useLocalSearchParams<ClanPageParams>();
    const { data: profiles, isPending } = useProfilesByClan(clan, true, { perPage: MAX_CLAN_PLAYERS });
    const [leaderboard, setLeaderboard] = useState<ILeaderboardDef | null>(null);

    const { data: leaderboards } = useLeaderboards();
    const leaderboardIds = leaderboards?.map((l) => l.leaderboardId);

    useEffect(() => {
        if (leaderboards) {
            setLeaderboard(leaderboards[0]);
        }
    }, [leaderboards]);

    if (!profiles?.[0]) {
        return isPending ? <LoadingScreen /> : <NotFound />;
    }

    return (
        <ScrollView contentContainerClassName="p-4 md:py-6 gap-6">
            <Stack.Screen options={{ title: `Clan ${clan}` }} />

            <View className="gap-2 -mx-4">
                <View className={cn('flex-row justify-between items-center', containerClassName)}>
                    <Text variant="header-lg">Members</Text>
                </View>
                <PlayerList list={profiles} variant="horizontal" />
            </View>

            <View className="gap-2">
                <View className="flex-row justify-between items-center gap-4 lg:gap-8">
                    <Text variant="header-lg">Rankings</Text>

                    {leaderboards && leaderboard && (
                        <View className="w-full flex-1 hidden lg:flex">
                            <ButtonPicker
                                flex={true}
                                value={leaderboard?.leaderboardId}
                                values={leaderboardIds ?? []}
                                image={(value) => (value === 'ew_1v1_redbullwololo' ? require('../../../../assets/red-bull-wololo.png') : undefined)}
                                formatter={(value) => leaderboards?.find((l) => l.leaderboardId === value)?.abbreviation ?? ''}
                                onSelect={(value) => {
                                    const newLeaderboard = leaderboards?.find((l) => l.leaderboardId === value);
                                    if (newLeaderboard) {
                                        setLeaderboard(newLeaderboard);
                                    }
                                }}
                            />
                        </View>
                    )}

                    <View className="flex lg:hidden">
                        <LeaderboardSelect
                            leaderboardId={leaderboard?.leaderboardId}
                            onLeaderboardIdChange={(value) => {
                                const newLeaderboard = leaderboards?.find((l) => l.leaderboardId === value);
                                if (newLeaderboard) {
                                    setLeaderboard(newLeaderboard);
                                }
                            }}
                        />
                    </View>
                </View>

                <LeaderboardSnapshot clan={clan} leaderboardId={leaderboard?.leaderboardId} perPage={MAX_CLAN_PLAYERS} />
            </View>
        </ScrollView>
    );
}
