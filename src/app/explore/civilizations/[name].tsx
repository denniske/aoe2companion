import { HeaderTitle } from '@app/components/header-title';
import { ScrollView } from '@app/components/scroll-view';
import { aoeCivKey, civDict, getCivNameById, parseCivDescription } from '@nex/data';
import { appConfig } from '@nex/dataset';
import { Image, ImageBackground } from '@/src/components/uniwind/image';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import React, { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import { getCivHistoryImage, getCivIconLocal } from '../../../helper/civs';
import { HighlightUnitAndTechs } from '../../../helper/highlight';
import { MyText } from '../../../view/components/my-text';
import { TechTree } from '../../../view/components/tech-tree';
import { TechCompBig } from '../../../view/tech/tech-comp';
import { UnitCompBig } from '../../../view/unit/unit-comp';
import { useQuery } from '@tanstack/react-query';
import { useUniwind } from 'uniwind';
import NotFound from '@app/app/+not-found';
import { useBreakpoints } from '@app/hooks/use-breakpoints';
import { useCivVideo } from '@app/utils/video';
import { Text } from '@app/components/text';

export default function CivDetails() {
    const { name } = useLocalSearchParams<{ name: aoeCivKey }>();
    const civ = name!;
    const { theme } = useUniwind();
    const { isMedium } = useBreakpoints();
    const { data: video } = useCivVideo(appConfig.game === 'aoe2' ? civ.toLowerCase() : '');

    if (appConfig.game !== 'aoe2') {
        return <Civ4Details civ={civ} />;
    }

    const civDescription = parseCivDescription(civ);

    if (civDescription == null) {
        return <NotFound />;
    }

    const { type, boni, uniqueUnitsTitle, uniqueTechsTitle, teamBonusTitle, teamBonus } = civDescription;

    return (
        <ImageBackground
            tintColor={theme === 'dark' ? 'white' : 'black'}
            imageStyle={[styles.imageInner, isMedium && { height: 600, width: '50%' }]}
            contentFit={isMedium ? 'contain' : 'cover'}
            source={getCivHistoryImage(civ)}
            style={styles.image}
        >
            <Stack.Screen
                options={{
                    title: getCivNameById(civ),
                    headerTitle: () => <HeaderTitle icon={getCivIconLocal(civ)} title={getCivNameById(civ)} />,
                }}
            />
            <ScrollView>
                <View style={styles.detailsContainer} className="lg:flex-row lg:gap-6">
                    <View className="lg:flex-1">
                        <MyText style={styles.content}>{type}</MyText>

                        <View style={styles.box}>
                            <MyText style={styles.heading}>Bonus</MyText>
                            {boni.map((bonus, i) => (
                                <View key={i} style={styles.bonusRow}>
                                    <MyText style={styles.bullet}>• </MyText>
                                    <MyText style={styles.content}>
                                        <HighlightUnitAndTechs str={bonus} />
                                    </MyText>
                                </View>
                            ))}
                        </View>

                        <View style={styles.box}>
                            <MyText style={styles.heading}>{uniqueUnitsTitle.replace(':', '')}</MyText>
                            {civDict[civ].uniqueUnits.map((unit) => (
                                <UnitCompBig key={unit} unit={unit} />
                            ))}
                        </View>

                        <View style={styles.box}>
                            <MyText style={styles.heading}>{uniqueTechsTitle.replace(':', '')}</MyText>
                            {civDict[civ].uniqueTechs.map((tech) => (
                                <TechCompBig key={tech} tech={tech} />
                            ))}
                        </View>

                        <View style={styles.box}>
                            <MyText style={styles.heading}>{teamBonusTitle.replace(':', '')}</MyText>
                            <MyText style={styles.content}>
                                <HighlightUnitAndTechs str={teamBonus} />
                            </MyText>
                        </View>

                        {video && (
                            <View className="py-4 gap-0.5">
                                <Text variant="header-lg">Video Guide</Text>
                                <Text variant="label-sm">By {video.author}</Text>
                                <Link
                                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                                    target="_blank"
                                    className="flex-row w-full aspect-video"
                                >
                                    <Image
                                        source={{ uri: video.thumbnailUrl }}
                                        className="w-full h-full rounded-lg cursor-pointer transition-all hover:scale-105 hover:opacity-80"
                                    />
                                </Link>
                            </View>
                        )}
                    </View>

                    <View style={styles.box} className="lg:flex-1">
                        <TechTree civ={civ} />
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

interface ICivInfoItem {
    title: string;
    description?: string;
    list?: string[];
}

export function Civ4Details({ civ }: { civ: aoeCivKey }) {
    const civDataFileMapping = {
        AbbasidDynasty: 'abbasid',
        Chinese: 'chinese',
        DelhiSultanate: 'delhi',
        English: 'english',
        French: 'french',
        HolyRomanEmpire: 'hre',
        Mongols: 'mongols',
        Rus: 'rus',
        Malians: 'malians',
        Ottomans: 'ottomans',
        Byzantines: 'byzantines',
        Japanese: 'japanese',
        JeanneDArc: 'jeannedarc',
        Ayyubids: 'ayyubids',
        ZhuXiSLegacy: 'zhuxi',
        OrderOfTheDragon: 'orderofthedragon',
        HouseOfLancaster: 'lancaster',
        KnightsTemplar: 'templar',
        SengokuDaimyo: 'sengoku',
        TughlaqDynasty: 'tughlaq',
        GoldenHorde: 'goldenhorde',
        MacedonianDynasty: 'macedonian',
    } as any;

    const { data: civData } = useQuery({
        queryKey: ['civ-infos', civ],
        queryFn: async () =>
            (await fetch(`https://raw.githubusercontent.com/aoe4world/data/main/civilizations/${civDataFileMapping[civ]}.json`)).json(),
    });

    if (!civData) return null;

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: () => <HeaderTitle iconStyle={{ width: 56 }} icon={getCivIconLocal(civ)} title={getCivNameById(civ)} />,
                }}
            />
            <ScrollView>
                <View style={styles.detailsContainer}>
                    <MyText style={styles.contentDescription}>{civData.description}</MyText>

                    {civData.overview.map((item: ICivInfoItem, i: number) => (
                        <Fragment key={item.title}>
                            <MyText style={styles.infoTitle}>{item.title}</MyText>
                            {item.description != null && <MyText style={styles.content}>{item.description}</MyText>}
                            {item.list != null &&
                                item.list.map((str, i) => (
                                    <MyText key={i} style={styles.content}>
                                        • {str}
                                    </MyText>
                                ))}
                        </Fragment>
                    ))}
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    imageInner: {
        opacity: 0.1,
        alignSelf: 'flex-end',
        bottom: -50,
        top: undefined,
        height: 400,
    },
    image: {
        flex: 1,
    },
    heading: {
        marginVertical: 10,
        lineHeight: 20,
        fontWeight: 'bold',
    },
    box: {},
    content: {
        textAlign: 'left',
        lineHeight: 22,
    },
    bullet: {
        textAlign: 'left',
        lineHeight: 22,
        flexShrink: 0,
    },
    detailsContainer: {
        flex: 1,
        padding: 20,
    },
    bonusRow: {
        flexDirection: 'row',
    },
    infoTitle: {
        textAlign: 'left',
        lineHeight: 22,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 8,
    },
    contentDescription: {
        textAlign: 'left',
        lineHeight: 22,
        marginVertical: 12,
    },
});
