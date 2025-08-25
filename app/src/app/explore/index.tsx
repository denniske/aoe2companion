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
import { getCivIcon, getCivIconLocal } from '@app/helper/civs';
import { getTechIcon } from '@app/helper/techs';
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
import { appConfig } from '@nex/dataset';
import { buildsData } from 'data/src/data/builds';
import { Image } from 'expo-image';
import { Redirect, Stack, router } from 'expo-router';
import { compact, get, orderBy, reverse, sortBy, uniq } from 'lodash';
import { useState } from 'react';
import { ImageSourcePropType, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '@app/helper/translate';
import { useMaps } from '@app/queries/all';

type Item =
    | { name: Civ; title: string; type: 'civ', image?: any }
    | { name: Unit; title: string; type: 'unit'; section: string, image?: any }
    | { name: Building; title: string; type: 'building'; section: string, image?: any }
    | { name: Tech; title: string; type: 'tech'; section?: string, image?: any }
    | { name: string; title: string; type: 'map'; section?: string, image?: any };

const typeAttributes: Record<Item['type'], { path: string; labelKey: string; title: (name: any) => string; icon: (name: any) => ImageSourcePropType }> =
    {
        civ: { path: 'civilizations', labelKey: 'explore.civilization', title: getCivNameById, icon: getCivIconLocal },
        unit: { path: 'units', labelKey: 'explore.unit', title: getUnitName, icon: getUnitIcon },
        building: { path: 'buildings', labelKey: 'explore.building', title: getBuildingName, icon: getBuildingIcon },
        tech: { path: 'technologies', labelKey: 'explore.tech', title: getTechName, icon: getTechIcon },
        map: { path: 'maps', labelKey: 'explore.map', title: getTechName, icon: getTechIcon },
    };

const Result: React.FC<{ item: Item; index: number }> = ({ item, index }) => {
    const getTranslation = useTranslation();
    const { path, labelKey, title, icon } = typeAttributes[item.type];

    return (
        <TouchableOpacity
            className={`flex-row items-center py-2.5 gap-2 -mx-4 px-4 -mb-px ${index === 0 ? 'bg-gold-100 dark:bg-blue-900 z-10' : ''}`}
            onPress={() => router.navigate(`/explore/${path}/${item.name}`)}
        >
            <Image source={item.image} className="w-8 h-8" />
            <View className="flex-1">
                <Text variant="label">{item.title}</Text>
            </View>
            <Text color="subtle" variant="body-sm">
                {item.type !== 'civ' && item.section && item.section} {getTranslation(labelKey as any)}
            </Text>
        </TouchableOpacity>
    );
};

export default function Explore() {
    const getTranslation = useTranslation();
    const formattedBuilds = buildsData.map((build) => ({
        ...build,
        avg_rating: build.avg_rating ?? 0,
        number_of_ratings: build.number_of_ratings ?? 0,
    }));
    const { data: maps } = useMaps();
    const sortedBuilds = reverse(sortBy(formattedBuilds, ['avg_rating', 'number_of_ratings']));
    const [search, setSearch] = useState('');
    const allData: Item[] = [
        ...civs.map<Item>((civ) => ({
            name: civ,
            title: getCivNameById(civ),
            image: getCivIconLocal(civ),
            type: 'civ'
        })),
        ...allUnitSections.flatMap((section) =>
            section.data.map<Item>((unit) => ({
                name: unit,
                title: getUnitName(unit),
                image: getUnitIcon(unit),
                type: 'unit',
                section: getTranslation(section.title as any)
            }))
        ),
        ...buildingSections.flatMap((section) =>
            section.data.map<Item>((building) => ({
                name: building,
                title: getBuildingName(building),
                image: getBuildingIcon(building),
                type: 'building',
                section: getTranslation(section.title as any),
            }))
        ),
        ...techSections.flatMap((section) =>
            section.data.map<Item>((tech) => ({
                name: tech,
                title: getTechName(tech),
                image: getTechIcon(tech),
                type: 'tech',
                section: section.building ? getBuildingName(section.building) : getCivNameById(section.civ!),
            }))
        ),
        ...compact(maps).map((map) => ({
            name: map.mapId,
            title: map.mapName,
            image: { uri: map.imageUrl },
            type: 'map'
        }) as Item),
    ];
    const filteredData = search
        ? uniq([
              ...allData.filter((item) => item.title.toLowerCase().includes(search.toLowerCase())),
              ...allData.filter((item) => item.type !== 'civ' && item.section?.toLowerCase().includes(search.toLowerCase())),
          ])
        : [];

    if (appConfig.game !== 'aoe2') {
        return <Redirect href="/explore/civilizations" />;
    }

    return (
        <KeyboardAvoidingView>
            <View className="flex-1 pt-4 gap-5">
                <Stack.Screen
                    options={{
                        animation: 'none',
                        title: getTranslation('explore.title'),
                        headerRight: () => (
                            <Button icon="info-circle" href="/explore/tips">
                                {getTranslation('explore.tips')}
                            </Button>
                        ),
                    }}
                />

                <View className="px-4">
                    <Field
                        type="search"
                        value={search}
                        onSubmitEditing={() => {
                            const topResult = filteredData[0];
                            if (topResult) {
                                const { path } = typeAttributes[topResult.type];
                                router.navigate(`/explore/${path}/${topResult.name}`);
                            }
                        }}
                        onChangeText={setSearch}
                        placeholder={getTranslation('explore.search.placeholder')}
                    />
                </View>

                {search ? (
                    <FlatList
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle="px-4 pb-4"
                        data={filteredData}
                        ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-200 dark:bg-gray-800 w-full" />}
                        renderItem={(props) => <Result {...props} />}
                    />
                ) : (
                    <ScrollView className="flex-1" contentContainerStyle="gap-5 pb-4" keyboardShouldPersistTaps="handled">

                        <View className="gap-2">
                            <View className="flex-row justify-between items-center px-4">
                                <Text variant="header-lg">{getTranslation('explore.civilizations')}</Text>
                                <Link href="/explore/civilizations">{getTranslation('explore.viewall')}</Link>
                            </View>

                            <FlatList
                                initialNumToRender={5}
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
                                <Text variant="header-lg">{getTranslation('explore.units')}</Text>
                                <Link href="/explore/units">{getTranslation('explore.viewall')}</Link>
                            </View>

                            <FlatList
                                initialNumToRender={5}
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
                                <Text variant="header-lg">{getTranslation('explore.buildings')}</Text>
                                <Link href="/explore/buildings">{getTranslation('explore.viewall')}</Link>
                            </View>

                            <FlatList
                                initialNumToRender={5}
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
                                <Text variant="header-lg">{getTranslation('explore.technologies')}</Text>
                                <Link href="/explore/technologies">{getTranslation('explore.viewall')}</Link>
                            </View>

                            <FlatList
                                initialNumToRender={5}
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
                                <Text variant="header-lg">{getTranslation('explore.buildorders')}</Text>
                                <Link href="/explore/build-orders">{getTranslation('explore.viewall')}</Link>
                            </View>

                            <FlatList
                                initialNumToRender={5}
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

                        <View className="gap-2">
                            <View className="flex-row justify-between items-center px-4">
                                <Text variant="header-lg">{getTranslation('explore.maps')}</Text>
                                <Link href="/explore/maps">{getTranslation('explore.viewall')}</Link>
                            </View>

                            <FlatList
                                initialNumToRender={5}
                                showsHorizontalScrollIndicator={false}
                                className="flex-none"
                                horizontal
                                keyboardShouldPersistTaps="always"
                                data={orderBy(compact(maps), map => map.mapName)}
                                contentContainerStyle="gap-2.5 px-4"
                                renderItem={({ item: map }) => (
                                    <Card direction="vertical" className="w-20 items-center py-2.5 px-1 gap-1" href={`/explore/maps/${map.mapId}`}>
                                        <Image className="w-8 h-8" source={{ uri: map.imageUrl }} contentFit="contain" />
                                        <Text variant="label-sm" numberOfLines={1}>
                                            {map.mapName}
                                        </Text>
                                    </Card>
                                )}
                                keyExtractor={(item) => item.mapId}
                            />
                        </View>

                    </ScrollView>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}
