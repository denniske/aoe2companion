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
import { getUnitIcon } from '@app/helper/units';
import {
    allUnitSections,
    Building,
    buildingSections,
    Civ,
    civs,
    getBuildingName,
    getCivNameById,
    getTechName,
    getUnitName,
    orderCivs,
    Tech,
    techSections,
    Unit,
} from '@nex/data';
import { appConfig } from '@nex/dataset';
import { Image } from '@/src/components/uniwind/image';
import { Href, Redirect, router, Stack } from 'expo-router';
import { compact, orderBy, uniq } from 'lodash';
import React, { useState } from 'react';
import { ImageSourcePropType, Platform, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '@app/helper/translate';
import { useInfiniteBuilds, useMaps } from '@app/queries/all';
import { BuildCard } from '@app/view/components/build-order/build-card';
import FlatListLoadingIndicator from '@app/view/components/flat-list-loading-indicator';
import { containerClassName } from '@app/styles';
import { useBreakpoints } from '@app/hooks/use-breakpoints';

type Item =
    | { name: Civ; title: string; type: 'civ'; image?: any }
    | { name: Unit; title: string; type: 'unit'; section: string; image?: any }
    | { name: Building; title: string; type: 'building'; section: string; image?: any }
    | { name: Tech; title: string; type: 'tech'; section?: string; image?: any }
    | { name: string; title: string; type: 'map'; section?: string; image?: any };

const typeAttributes: Record<
    Item['type'],
    { path: string; labelKey: string; title: (name: any) => string; icon: (name: any) => ImageSourcePropType }
> = {
    civ: { path: 'civilizations', labelKey: 'explore.civilization', title: getCivNameById, icon: getCivIconLocal },
    unit: { path: 'units', labelKey: 'explore.unit', title: getUnitName, icon: getUnitIcon },
    building: { path: 'buildings', labelKey: 'explore.building', title: getBuildingName, icon: getBuildingIcon },
    tech: { path: 'technologies', labelKey: 'explore.tech', title: getTechName, icon: getTechIcon },
    map: { path: 'maps', labelKey: 'explore.map', title: getTechName, icon: getTechIcon },
};

const ExploreCard: React.FC<{ text: string; href: Href } & ({ image: ImageSourcePropType } | { icon: IconName })> = ({ text, href, ...props }) => {
    const {isMedium} = useBreakpoints();

    return (
        <Card direction="vertical" className="w-20 md:w-36 items-center py-2.5 px-1 gap-1 md:py-4 md:px-2 md:gap-2" href={href}>
            {'image' in props ? (
                <Image className="w-8 h-8 md:w-12 md:h-12" source={props.image} contentFit="contain" />
            ) : (
                <Icon icon={props.icon} size={isMedium ? 36 : 22} color="brand" />
            )}
            <Text variant={isMedium ? 'label' : 'label-sm'} numberOfLines={1}>
                {text}
            </Text>
        </Card>
    );
};

const Result: React.FC<{ item: Item; index: number }> = ({ item, index }) => {
    const getTranslation = useTranslation();
    const { path, labelKey, title, icon } = typeAttributes[item.type];

    return (
        <TouchableOpacity
            className={`flex-row items-center py-2.5 gap-2 -mx-4 px-4 -mb-px ${index === 0 ? 'bg-gold-100 dark:bg-blue-900 z-10' : ''}`}
            onPress={() => router.navigate(`/explore/${path}/${item.name}` as any)}
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
    const { data: maps } = useMaps();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteBuilds({});
    const builds = data?.pages?.flatMap((p) => p.builds);

    const onEndReached = async () => {
        if (!hasNextPage || isFetchingNextPage) return;
        fetchNextPage();
    };

    const _renderFooter = () => {
        if (!isFetchingNextPage) return null;
        return <FlatListLoadingIndicator />;
    };

    const [search, setSearch] = useState('');
    const allData: Item[] = [
        ...civs.map<Item>((civ) => ({
            name: civ,
            title: getCivNameById(civ),
            image: getCivIconLocal(civ),
            type: 'civ',
        })),
        ...allUnitSections.flatMap((section) =>
            section.data.map<Item>((unit) => ({
                name: unit,
                title: getUnitName(unit),
                image: getUnitIcon(unit),
                type: 'unit',
                section: getTranslation(section.title as any),
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
        ...compact(maps).map(
            (map) =>
                ({
                    name: map.mapId,
                    title: map.mapName,
                    image: { uri: map.imageUrl },
                    type: 'map',
                } as Item)
        ),
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

                <View className={containerClassName}>
                    <Field
                        type="search"
                        value={search}
                        onSubmitEditing={() => {
                            const topResult = filteredData[0];
                            if (topResult) {
                                const { path } = typeAttributes[topResult.type];
                                router.navigate(`/explore/${path}/${topResult.name}` as any);
                            }
                        }}
                        onChangeText={setSearch}
                        placeholder={getTranslation('explore.search.placeholder')}
                    />
                </View>

                {search ? (
                    <FlatList
                        keyboardShouldPersistTaps="handled"
                        contentContainerClassName="px-4 pb-4"
                        data={filteredData}
                        ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-200 dark:bg-gray-800 w-full" />}
                        renderItem={(props) => <Result {...props} />}
                    />
                ) : (
                    <ScrollView className="flex-1" contentContainerClassName="gap-5 pb-4" keyboardShouldPersistTaps="handled">
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
                                contentContainerClassName="gap-2.5 px-4"
                                renderItem={({ item: civ }) => (
                                    <ExploreCard href={`/explore/civilizations/${civ}`} image={getCivIconLocal(civ)} text={getCivNameById(civ)} />
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
                                contentContainerClassName="gap-2.5 px-4"
                                renderItem={({ item: { title, icon } }) => (
                                    <ExploreCard
                                        icon={icon as IconName}
                                        text={getTranslation(title as any)}
                                        href={`/explore/units?section=${title}`}
                                    />
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
                                contentContainerClassName="gap-2.5 px-4"
                                renderItem={({ item: { title, icon } }) => (
                                    <ExploreCard
                                        icon={icon as IconName}
                                        text={getTranslation(title as any)}
                                        href={`/explore/buildings?section=${title}`}
                                    />
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
                                contentContainerClassName="gap-2.5 px-4"
                                renderItem={({ item: { building, civ } }) => (
                                    <ExploreCard
                                        image={building ? getBuildingIcon(building) : getCivIconLocal(civ!)}
                                        text={building ? getBuildingName(building).replace('Camp', '').replace('Range', '') : getCivNameById(civ!)}
                                        href={`/explore/technologies?section=${building ?? civ}`}
                                    />
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
                                data={builds}
                                contentContainerClassName="gap-2.5 px-4"
                                renderItem={({ item }) => <BuildCard size="small" {...item} />}
                                keyExtractor={(item) => item.id.toString()}
                                ListFooterComponent={_renderFooter}
                                onEndReached={Platform.OS === 'web' ? undefined : onEndReached}
                                onEndReachedThreshold={0.1}
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
                                data={orderBy(compact(maps), (map) => map.mapName)}
                                contentContainerClassName="gap-2.5 px-4"
                                renderItem={({ item: map }) => (
                                    <ExploreCard href={`/explore/maps/${map.mapId}`} image={{ uri: map.imageUrl }} text={map.mapName} />
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
