import React, { useEffect, useState } from 'react';
import { buildsData } from '../../../data/src/data/builds';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from 'app/App2';
import { BuildListPage, BuildDetail } from './build-order';
import { getTranslation } from '../helper/translate';
import TextHeader from './components/navigation-header/text-header';
import { getBuildById } from '../../../data/src/helper/builds';
import { genericCivIcon, getCivIconLocal } from '../helper/civs';
import IconHeader from './components/navigation-header/icon-header';
import { useFavoritedBuild } from '../service/storage';
import { Button, TouchableOpacity, View, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { getItem, reloadAll, setItem } from '../../../modules/widget';
import { MyText } from './components/my-text';

const GROUP_NAME = 'group.expo.modules.widgetsync.example';
const getSharedData = getItem(GROUP_NAME);
const setSharedData = setItem(GROUP_NAME);

export function BuildMenu(props: any) {
    const { toggleFavorite, isFavorited } = useFavoritedBuild(props.route.params.build);

    return (
        <TouchableOpacity hitSlop={10} onPress={toggleFavorite} style={{ paddingRight: 12 }}>
            <FontAwesome5 solid={isFavorited} name="heart" size={20} color="#ef4444" />
        </TouchableOpacity>
    );
}

export function BuildTitle(props: any) {
    const build = getBuildById(props.route?.params?.build);

    if (build) {
        return (
            <IconHeader
                icon={getCivIconLocal(build.civilization) ?? genericCivIcon}
                text={build.civilization}
                subtitle={build.title.replace(build.civilization, '')}
                onLayout={props.titleProps.onLayout}
            />
        );
    }
    return <TextHeader text={getTranslation('builds.title')} onLayout={props.titleProps.onLayout} />;
}

const BuildPage = () => {
    const [value, setValue] = useState(getSharedData(GROUP_NAME) ?? '');

    useEffect(() => {
        setSharedData('savedData', value);
        reloadAll();
    }, [value]);

    const onPress = () => {
        setValue('Hello from App.tsx');
    };

    const clear = () => {
        setValue('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <MyText style={styles.description}>Current value</MyText>
                <MyText style={styles.value}> {value}</MyText>
            </View>
            <View style={styles.spacer} />
            <Button onPress={onPress} title="Set value" />
            <Button onPress={clear} title="Clear" />
        </View>
    );
    // const route = useRoute<RouteProp<RootStackParamList, 'Guide'>>();
    // const build = buildsData.find((build) => build.id === route.params?.build);

    // if (build) {
    //     return <BuildDetail {...build} />;
    // }

    // return <BuildListPage />;
};

export default BuildPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        width: '100%',
    },
    description: {
        fontSize: 14,
        color: 'dimgray',
    },
    value: {
        fontSize: 20,
        fontWeight: '500',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
    },
    buttonText: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    spacer: {
        height: 10,
    },
});
