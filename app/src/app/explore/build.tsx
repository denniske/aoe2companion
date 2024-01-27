import React, { useEffect } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from 'app/App2';
import { BuildListPage, BuildDetail } from '@app/view/build-order';
import { getTranslation } from '../../helper/translate';
import TextHeader from '@app/view/components/navigation-header/text-header';
import { getBuildById } from '../../../../data/src/helper/builds';
import { genericCivIcon, getCivIconLocal } from '../../helper/civs';
import IconHeader from '@app/view/components/navigation-header/icon-header';
import { useFavoritedBuild } from '../../service/storage';
import { TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useSelector } from '../../redux/reducer';

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
    const route = useRoute<RouteProp<RootStackParamList, 'Guide'>>();
    const build = getBuildById(route.params?.build);
    const config = useSelector((state) => state.config);

    useEffect(() => {
        if (config.preventScreenLockOnGuidePage) {
            activateKeepAwakeAsync('guide-page');
        }
        return () => {
            // It may happen that we did not activate the keep awake, so we need to catch the error.
            deactivateKeepAwake('guide-page').catch(() => {});
        };
    });

    if (build) {
        return <BuildDetail {...build} />;
    }

    return <BuildListPage />;
};

export default BuildPage;
