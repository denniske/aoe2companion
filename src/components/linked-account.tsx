import { TouchableOpacity, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { openLink } from '@app/helper/url';
import { noop } from 'lodash';
import { Text } from '@app/components/text';
import { Image } from '@app/components/uniwind/image';
import { appConfig } from '@nex/dataset';
import React from 'react';
import { useAppTheme } from '@app/theming';
import { useTranslation } from '@app/helper/translate';

export function getPlatformIcon(platform: string) {
    return {
        'steam': 'steam',
        'xbox': 'xbox',
        'psn': 'playstation',
    }[platform];
}

export function LinkedPlatformAccount({steamId, platform}: {steamId: string, platform: 'steam' | 'xbox' | 'psn'}) {
    const theme = useAppTheme();
    const getTranslation = useTranslation();
    const platformName = getTranslation(`platform.${platform}`)
    const steamProfileUrl = `https://steamcommunity.com/profiles/${steamId}`;
    return (
        <View className="flex flex-row gap-2 items-center">
            <View className="flex-col items-center w-8">
                <FontAwesome5 name={getPlatformIcon(platform)} size={30} color={theme.textNoteColor} />
            </View>
            <TouchableOpacity className="flex-col gap-0" onPress={() => platform === 'xbox' ? openLink(steamProfileUrl) : noop()} disabled={platform !== 'xbox'}>
                <Text variant="header-xs">{platformName}</Text>
                <Text variant="body">{steamId}</Text>
            </TouchableOpacity>
        </View>
    );
}

export function LinkedAoEAccount({profileId}: {profileId: number}) {
    const ageofempiresProfileUrl = `https://www.ageofempires.com/stats/?game=${appConfig.game}&profileId=${profileId}`;
    return (
        <View className="flex flex-row gap-2 items-center">
            <Image source={require('../../assets/icon/ageofempires.png')} className="w-8 h-8 rounded-md" />
            <TouchableOpacity className="flex-col gap-0" onPress={() => openLink(ageofempiresProfileUrl)}>
                <Text variant="header-xs">{appConfig.liquipediaName}</Text>
                <Text variant="body">{profileId}</Text>
            </TouchableOpacity>
        </View>
    );
}

export function LinkedAoECompanionAccount({profileId}: {profileId: number}) {
    const aoecompanionProfileUrl = `https://${appConfig.hostAoeCompanion}/profile/${profileId}`;
    return (
        <View className="flex flex-row gap-2 items-center">
            <Image source={appConfig.game === 'aoe2' ? require('../../assets/icon/aoe2companion.png') :  require('../../assets/icon/aoe4companion.png')} className="w-8 h-8 rounded-md" />
            <TouchableOpacity className="flex-col gap-0" onPress={() => openLink(aoecompanionProfileUrl)}>
                <Text variant="header-xs">{appConfig.app.name}</Text>
                <Text variant="body">{profileId}</Text>
            </TouchableOpacity>
        </View>
    );
}
