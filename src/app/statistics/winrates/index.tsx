import { useWinrates } from '@app/api/winrates';
import { Link } from '@app/components/link';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { CivWinrateCard } from '@app/components/winrates/civ-card';
import { Slider2 } from '@app/view/components/slider2';
import { Stack } from 'expo-router';
import { sortBy } from 'lodash';
import React from 'react';
import { View } from 'react-native';
import { useTranslation } from '@app/helper/translate';

export default function WinratesPage() {
    const getTranslation = useTranslation();
    const { winrates } = useWinrates();
    const sortedWinrates = winrates ? sortBy(winrates?.civs, 'win_rate') : Array(5).fill(null);
    const sortedPlayrates = winrates ? sortBy(winrates?.civs, 'play_rate') : Array(5).fill(null);

    return (
        <ScrollView className="flex-1" contentContainerStyle="pt-4 gap-5">
            <Stack.Screen
                options={{
                    title: getTranslation('winrates.title'),
                }}
            />
            <View className="gap-2">
                <View className="flex-row justify-between items-center px-4">
                    <Text variant="header-lg">{getTranslation('winrates.highestwinrates')}</Text>
                </View>
                <Slider2
                    className="pb-6"
                    paginationStyle={{ bottom: 0 }}
                    slides={[...sortedWinrates]
                        .reverse()
                        .slice(0, 5)
                        .map((civ) => (
                            <CivWinrateCard civ={civ} />
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
                    slides={[...sortedWinrates].slice(0, 5).map((civ) => (
                        <CivWinrateCard civ={civ} />
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
                        .map((civ) => (
                            <CivWinrateCard civ={civ} />
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
                    slides={[...sortedPlayrates].slice(0, 5).map((civ) => (
                        <CivWinrateCard civ={civ} />
                    ))}
                />
            </View>

            <Text variant="body-sm" className="px-4 text-center">
                Civ and map stats provided by{' '}
                <Link variant="body-sm" href="https://aoestats.io">
                    aoestats.io
                </Link>
            </Text>
        </ScrollView>
    );
}
