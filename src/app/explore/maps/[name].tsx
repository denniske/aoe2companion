import { HeaderTitle } from '@app/components/header-title';
import { ScrollView } from '@app/components/scroll-view';
import { Image } from '@/src/components/uniwind/image';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MyText } from '../../../view/components/my-text';
import { useMaps } from '@app/queries/all';
import { compact } from 'lodash';

export default function MapDetails() {
    const { name } = useLocalSearchParams<{ name: string }>();
    const { data: maps } = useMaps();
    const map = compact(maps).find((m) => m.mapId === name);

    // if (appConfig.game !== 'aoe2') {
    //     return <Civ4Details civ={map} />;
    // }

    if (map == null) {
        return <View />;
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerTitle: () => <HeaderTitle title={map.mapName} />,
                    // headerTitle: () => <HeaderTitle icon={{uri: map.imageUrl}} title={map.mapName} />,
                }}
            />
            <ScrollView>
                <View style={styles.detailsContainer}>
                    <MyText style={styles.content}>{map.description}</MyText>
                    <Image source={{ uri: map.imageUrl }} style={styles.image} />
                </View>
            </ScrollView>
        </View>
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
    container: {
        flex: 1,
    },
    image: {
        width: 250,
        height: 250,
        alignSelf: 'center',
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
        gap: 30,
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
