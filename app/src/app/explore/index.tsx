import { Button } from '@app/components/button';
import { Card } from '@app/components/card';
import { Field } from '@app/components/field';
import { FlatList } from '@app/components/flat-list';
import { Icon, IconName } from '@app/components/icon';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { Link } from '@app/components/link';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { getBuildingIcon } from '@app/helper/buildings';
import { getCivIconLocal } from '@app/helper/civs';
import { getTechIcon } from '@app/helper/techs';
import { getTranslation } from '@app/helper/translate';
import { getUnitIcon } from '@app/helper/units';
import BuildCard from '@app/view/components/build-order/build-card';
import {
    orderCivs,
    civs,
    getCivNameById,
    techSections,
    getBuildingName,
    allUnitSections,
    buildingSections,
    Civ,
    Unit,
    Building,
    Tech,
    getUnitName,
    getTechName,
} from '@nex/data';
import { buildsData } from 'data/src/data/builds';
import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import { reverse, sortBy, uniq } from 'lodash';
import { useState } from 'react';
import { ImageSourcePropType, TouchableOpacity, View } from 'react-native';

type Item =
    | { name: Civ; type: 'civ' }
    | { name: Unit; type: 'unit'; section: string }
    | { name: Building; type: 'building'; section: string }
    | { name: Tech; type: 'tech'; section?: string };

const typeAttributes: Record<Item['type'], { path: string; label: string; title: (name: any) => string; icon: (name: any) => ImageSourcePropType }> =
    {
        civ: { path: 'civilizations', label: 'Civilization', title: getCivNameById, icon: getCivIconLocal },
        unit: { path: 'units', label: 'Unit', title: getUnitName, icon: getUnitIcon },
        building: { path: 'buildings', label: 'Building', title: getBuildingName, icon: getBuildingIcon },
        tech: { path: 'technologies', label: 'Tech', title: getTechName, icon: getTechIcon },
    };

const Result: React.FC<{ item: Item }> = ({ item }) => {
    const { path, label, title, icon } = typeAttributes[item.type];

    return (
        <TouchableOpacity className="flex-row items-center py-2.5 gap-2" onPress={() => router.navigate(`/explore/${path}/${item.name}`)}>
            <Image source={icon(item.name)} className="w-8 h-8" />
            <View className="flex-1">
                <Text variant="label">{title(item.name)}</Text>
            </View>
            <Text color="subtle" variant="body-sm">
                {item.type !== 'civ' && item.section && item.section} {label}
            </Text>
        </TouchableOpacity>
    );
};

export default function Explore() {
    const formattedBuilds = buildsData.map((build) => ({
        ...build,
        avg_rating: build.avg_rating ?? 0,
        number_of_ratings: build.number_of_ratings ?? 0,
    }));
    const sortedBuilds = reverse(sortBy(formattedBuilds, ['avg_rating', 'number_of_ratings']));
    const [search, setSearch] = useState('');
    const allData: Item[] = [
        ...civs.map<Item>((civ) => ({ name: civ, type: 'civ' })),
        ...allUnitSections.flatMap((section) =>
            section.data.map<Item>((unit) => ({ name: unit, type: 'unit', section: getTranslation(section.title as any) }))
        ),
        ...buildingSections.flatMap((section) =>
            section.data.map<Item>((building) => ({ name: building, type: 'building', section: getTranslation(section.title as any) }))
        ),
        ...techSections.flatMap((section) =>
            section.data.map<Item>((tech) => ({
                name: tech,
                type: 'tech',
                section: section.building ? getBuildingName(section.building) : getCivNameById(section.civ!),
            }))
        ),
    ];
    const filteredData = search
        ? uniq([
              ...allData.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())),
              ...allData.filter((item) => item.type !== 'civ' && item.section?.toLowerCase().includes(search.toLowerCase())),
          ])
        : [];

    return (
        <KeyboardAvoidingView>
            <View className="flex-1 pt-4 gap-5">
                <Stack.Screen
                    options={{
                        title: 'Explore',
                        headerRight: () => (
                            <Button icon="info-circle" href="/explore/tips">
                                Tips
                            </Button>
                        ),
                    }}
                />

                <View className="px-4">
                    <Field type="search" value={search} onChangeText={setSearch} placeholder="Search for civs, units, buildings, or techs" />
                </View>

                {search ? (
                    <FlatList
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle="px-4 pb-4"
                        data={filteredData}
                        ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-200 dark:bg-gray-800 w-full" />}
                        renderItem={({ item }) => <Result item={item} />}
                    />
                ) : (
                    <ScrollView className="flex-1" contentContainerStyle="gap-5 pb-4" keyboardShouldPersistTaps="handled">
                        <View className="gap-2">
                            <View className="flex-row justify-between items-center px-4">
                                <Text variant="header-lg">Civilizations</Text>
                                <Link href="/explore/civilizations">View All</Link>
                            </View>

                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                className="flex-none"
                                horizontal
                                keyboardShouldPersistTaps="always"
                                data={orderCivs(civs.filter((c) => c !== 'Indians'))}
                                contentContainerStyle="gap-2.5 px-4"
                                renderItem={({ item: civ }) => (
                                    <Card direction="vertical" className="w-20 items-center py-2.5 px-1 gap-1" href={`/explore/civilizations/${civ}`}>
                                        <Image className="w-8 h-8" source={getCivIconLocal(civ)} contentFit="contain" />
                                        <Text variant="label-sm" numberOfLines={1}>
                                            {getCivNameById(civ)}
                                        </Text>
                                    </Card>
                                )}
                                keyExtractor={(item) => item}
                            />
                        </View>

                        <View className="gap-2">
                            <View className="flex-row justify-between items-center px-4">
                                <Text variant="header-lg">Units</Text>
                                <Link href="/explore/units">View All</Link>
                            </View>

                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                className="flex-none"
                                horizontal
                                keyboardShouldPersistTaps="always"
                                data={allUnitSections}
                                contentContainerStyle="gap-2.5 px-4"
                                renderItem={({ item: { title, icon } }) => (
                                    <Card
                                        direction="vertical"
                                        className="w-20 items-center py-2.5 px-1 gap-1"
                                        href={`/explore/units?section=${title}`}
                                    >
                                        <Icon icon={icon as IconName} size={22} color="brand" />
                                        <Text variant="label-sm" numberOfLines={1}>
                                            {getTranslation(title as any)}
                                        </Text>
                                    </Card>
                                )}
                                keyExtractor={(item) => item.title}
                            />
                        </View>

                        <View className="gap-2">
                            <View className="flex-row justify-between items-center px-4">
                                <Text variant="header-lg">Buildings</Text>
                                <Link href="/explore/buildings">View All</Link>
                            </View>

                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                className="flex-none"
                                horizontal
                                keyboardShouldPersistTaps="always"
                                data={buildingSections}
                                contentContainerStyle="gap-2.5 px-4"
                                renderItem={({ item: { title, icon } }) => (
                                    <Card
                                        direction="vertical"
                                        className="w-20 items-center py-2.5 px-1 gap-1"
                                        href={`/explore/buildings?section=${title}`}
                                    >
                                        <Icon icon={icon as IconName} size={22} color="brand" />
                                        <Text variant="label-sm" numberOfLines={1}>
                                            {getTranslation(title as any)}
                                        </Text>
                                    </Card>
                                )}
                                keyExtractor={(item) => item.title}
                            />
                        </View>

                        <View className="gap-2">
                            <View className="flex-row justify-between items-center px-4">
                                <Text variant="header-lg">Technologies</Text>
                                <Link href="/explore/technologies">View All</Link>
                            </View>

                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                className="flex-none"
                                horizontal
                                keyboardShouldPersistTaps="always"
                                data={techSections}
                                contentContainerStyle="gap-2.5 px-4"
                                renderItem={({ item: { building, civ } }) => (
                                    <Card
                                        direction="vertical"
                                        className="w-20 items-center py-2.5 px-1 gap-1"
                                        href={`/explore/technologies?section=${building ?? civ}`}
                                    >
                                        <Image
                                            className="w-8 h-8"
                                            source={building ? getBuildingIcon(building) : getCivIconLocal(civ!)}
                                            contentFit="contain"
                                        />
                                        <Text variant="label-sm" numberOfLines={1}>
                                            {building ? getBuildingName(building).replace('Camp', '').replace('Range', '') : getCivNameById(civ!)}
                                        </Text>
                                    </Card>
                                )}
                                keyExtractor={(item) => item.building || item.civ!}
                            />
                        </View>

                        <View className="gap-2">
                            <View className="flex-row justify-between items-center px-4">
                                <Text variant="header-lg">Build Orders</Text>
                                <Link href="/explore/build-orders">View All</Link>
                            </View>

                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                className="flex-none"
                                horizontal
                                keyboardShouldPersistTaps="always"
                                data={sortedBuilds}
                                contentContainerStyle="gap-2.5 px-4"
                                renderItem={({ item }) => <BuildCard size="small" {...item} />}
                                keyExtractor={(item) => item.id.toString()}
                            />
                        </View>
                    </ScrollView>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}
