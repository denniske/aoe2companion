import { useMeta } from '@app/api/meta';
import { ScrollView } from '@app/components/scroll-view';
import { MIN_RANKED_GAMES } from '@app/components/stats-overview/meta-helpers';
import { Text } from '@app/components/text';
import { CivWinrateCard, CivWinrateCardData } from '@app/components/winrates/civ-card';
import { Slider2 } from '@app/view/components/slider2';
import { Stack } from 'expo-router';
import { sortBy } from 'lodash';
import React from 'react';
import { View } from 'react-native';
import { useTranslation } from '@app/helper/translate';

// Our own /api/meta civ stats (ranked 1v1, last 30 days), mapped into the shape
// CivWinrateCard takes. Civs under MIN_RANKED_GAMES are left out, as on the other
// stats pages: a handful of games gives a meaningless extreme win rate.
export default function WinratesPage() {
    const getTranslation = useTranslation();
    const { data } = useMeta('civs');
    const civs: CivWinrateCardData[] | undefined = data?.civs
        .filter((c) => c.games >= MIN_RANKED_GAMES)
        .map((c) => ({ civ_name: c.civ, civName: c.civName, civImageUrl: c.civImageUrl, win_rate: c.winRate, play_rate: c.playRate, num_games: c.games }));
    const sortedWinrates = civs ? sortBy(civs, 'win_rate') : Array(5).fill(null);
    const sortedPlayrates = civs ? sortBy(civs, 'play_rate') : Array(5).fill(null);
    // Bars run to the most played civ, at least 8%: aoe4 has fewer civs, so its top play
    // rates pass the fixed 8% aoe2 used and the bar overflowed the card.
    const maxPlayrate = Math.max(8, Math.ceil(Math.max(0, ...(civs ?? []).map((c) => c.play_rate)) * 100));

    return (
        <ScrollView className="flex-1" contentContainerClassName="gap-5">
            <Stack.Screen
                options={{
                    title: getTranslation('winrates.title'),
                }}
            />
            <View className="gap-2 py-4">
                <View className="flex-row justify-between items-center px-4">
                    <Text variant="header-lg">{getTranslation('winrates.highestwinrates')}</Text>
                </View>
                <Slider2
                    className="pb-6"
                    paginationStyle={{ bottom: 0 }}
                    slides={[...sortedWinrates]
                        .reverse()
                        .slice(0, 5)
                        .map((civ, index) => (
                            <CivWinrateCard civ={civ} maxPlayrate={maxPlayrate} key={civ?.civ_name ?? index} />
                        ))}
                />
            </View>

            <View className="gap-2">
                <View className="flex-row justify-between items-center px-4">
                    <Text variant="header-lg">{getTranslation('winrates.lowestwinrates')}</Text>
                </View>
                <Slider2
                    className="pb-6"
                    paginationStyle={{ bottom: 0 }}
                    slides={[...sortedWinrates].slice(0, 5).map((civ, index) => (
                        <CivWinrateCard civ={civ} maxPlayrate={maxPlayrate} key={civ?.civ_name ?? index} />
                    ))}
                />
            </View>

            <View className="gap-2">
                <View className="flex-row justify-between items-center px-4">
                    <Text variant="header-lg">{getTranslation('winrates.mostplayedcivilizations')}</Text>
                </View>
                <Slider2
                    className="pb-6"
                    paginationStyle={{ bottom: 0 }}
                    slides={[...sortedPlayrates]
                        .reverse()
                        .slice(0, 5)
                        .map((civ, index) => (
                            <CivWinrateCard civ={civ} maxPlayrate={maxPlayrate} key={civ?.civ_name ?? index} />
                        ))}
                />
            </View>

            <View className="gap-2">
                <View className="flex-row justify-between items-center px-4">
                    <Text variant="header-lg">{getTranslation('winrates.leastplayedcivilizations')}</Text>
                </View>
                <Slider2
                    className="pb-6"
                    paginationStyle={{ bottom: 0 }}
                    slides={[...sortedPlayrates].slice(0, 5).map((civ, index) => (
                        <CivWinrateCard civ={civ} maxPlayrate={maxPlayrate} key={civ?.civ_name ?? index} />
                    ))}
                />
            </View>

            <Text variant="body-sm" color="subtle" className="px-4 pb-4 text-center">
                Ranked 1v1 · last 30 days{data?.matches ? ` · ${data.matches.toLocaleString()} matches` : ''}
            </Text>
        </ScrollView>
    );
}
