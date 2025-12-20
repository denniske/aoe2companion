import { getCivIdByEnum } from '@nex/data';
import { appConfig } from '@nex/dataset';
import { Link, router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { CountryImage } from './country-image';
import { TextLoader } from './loader/text-loader';
import { MyText } from './my-text';
import { IStatAlly, IStatCiv, IStatMap, IStatOpponent } from '../../api/helper/api.types';
import { getCivIcon } from '../../helper/civs';
import { getMapImage } from '../../helper/maps';
import { createStylesheet } from '../../theming-new';
import { useTranslation } from '@app/helper/translate';

interface IRowPropsCiv {
    data: IStatCiv;
    type: 'civ';
}

interface IRowPropsMap {
    data: IStatMap;
    type: 'map';
}

interface IRowPropsAlly {
    data: IStatAlly;
    type: 'ally';
}

interface IRowPropsOpponent {
    data: IStatOpponent;
    type: 'opponent';
}

export function StatsHeader({ title }: any) {
    const getTranslation = useTranslation();
    const styles = useStyles();
    return (
        <View className="mt-4 mb-2">
            <View className="flex-row items-center">
                <MyText numberOfLines={1} className="flex-row flex-4 items-center">
                    {title}
                </MyText>
                <MyText numberOfLines={1} className="flex-row flex-1 items-center text-right">
                    {getTranslation('main.stats.heading.games')}
                </MyText>
                <MyText numberOfLines={1} className="flex-row flex-1 items-center text-right font-tabular">
                    {getTranslation('main.stats.heading.won')}*
                </MyText>
            </View>
        </View>
    );
}

export function StatsRow({ type, data }: IRowPropsCiv | IRowPropsMap | IRowPropsAlly | IRowPropsOpponent) {
    const styles = useStyles();

    if (!data) {
        return (
            <View className="flex-row items-center gap-1 my-1">
                <TextLoader className="flex-row flex-4 items-center" />
                <TextLoader className="flex-row flex-1 items-center text-right" />
                <TextLoader className="flex-row flex-1 items-center text-right font-tabular" />
            </View>
        );
    }

    const getIcon = () => {
        if (type === 'civ') {
            return getCivIcon(data);
        }
        if (type === 'map') {
            return getMapImage(data);
        }
    };

    const getName = () => {
        if (type === 'civ') {
            return data.civName;
        }
        if (type === 'map') {
            return data.mapName;
        }
        if ((type === 'ally' || type === 'opponent') && data.profileId) {
            return data.name;
        }
    };

    const won = (data.wins / data.games) * 100;

    return (
        <View className="flex-row items-center gap-1 my-1">
            <Link
                asChild
                href={
                    type === 'civ'
                        ? `/explore/civilizations/${getCivIdByEnum(data.civ)}`
                        : type === 'opponent' || type === 'ally'
                        ? `/players/${data.profileId}`
                        : `/explore/maps/${data.map}`
                }
            >
                <TouchableOpacity className="flex-row flex-4 items-center">
                    <View className="flex-row items-center w-full">
                        {(type === 'ally' || type === 'opponent') && <CountryImage country={data.country} />}
                        {type === 'civ' && <Image style={styles.civIcon as any} source={getIcon()} />}
                        {type === 'map' && <Image style={styles.icon as any} source={getIcon()} />}
                        <MyText>{getName()}</MyText>
                    </View>
                </TouchableOpacity>
            </Link>
            <MyText className="flex-row flex-1 items-center text-right font-tabular" numberOfLines={1}>
                {data.games}
            </MyText>
            <MyText className="flex-row flex-1 items-center text-right font-tabular" numberOfLines={1}>
                {isNaN(won) ? '-' : won.toFixed(0) + ' %'}
            </MyText>
        </View>
    );
}

const useStyles = createStylesheet(() =>
    StyleSheet.create({
        civIcon:
            appConfig.game === 'aoe2'
                ? {
                      width: 20,
                      height: 20,
                      marginRight: 5,
                  }
                : {
                      width: 36,
                      height: 20,
                      marginRight: 5,
                  },
        icon:
            appConfig.game === 'aoe2'
                ? {
                      width: 20,
                      height: 20,
                      marginRight: 5,
                  }
                : {
                      borderColor: '#C19049',
                      borderWidth: 1.2,
                      width: 20,
                      height: 20,
                      marginRight: 5,
                  },
    })
);
