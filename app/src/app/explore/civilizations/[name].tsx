import { HeaderTitle } from '@app/components/header-title';
import { ScrollView } from '@app/components/scroll-view';
import { aoeCivKey, civDict, getCivNameById, parseCivDescription } from '@nex/data';
import { ImageBackground } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { getCivHistoryImage, getCivIconLocal } from '../../../helper/civs';
import { HighlightUnitAndTechs } from '../../../helper/highlight';
import { MyText } from '../../../view/components/my-text';
import { TechTree } from '../../../view/components/tech-tree';
import { TechCompBig } from '../../../view/tech/tech-comp';
import { UnitCompBig } from '../../../view/unit/unit-comp';

export default function CivDetails() {
    const { name } = useLocalSearchParams<{ name: aoeCivKey }>();
    const civ = name!;
    const { colorScheme } = useColorScheme();

    const civDescription = parseCivDescription(civ);

    if (civDescription == null) {
        return <View />;
    }

    const { type, boni, uniqueUnitsTitle, uniqueTechsTitle, teamBonusTitle, teamBonus } = civDescription;

    return (
        <ImageBackground
            tintColor={colorScheme === 'dark' ? 'white' : 'black'}
            imageStyle={styles.imageInner}
            contentFit="cover"
            source={getCivHistoryImage(civ)}
            style={styles.image}
        >
            <Stack.Screen
                options={{
                    headerTitle: () => <HeaderTitle icon={getCivIconLocal(civ)} title={getCivNameById(civ)} />,
                }}
            />
            <ScrollView>
                <View style={styles.detailsContainer}>
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

                    <View style={styles.box}>
                        <TechTree civ={civ} />
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
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
});
