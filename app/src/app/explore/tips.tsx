import React, { Fragment, useEffect, useState } from 'react';
import { Image, ImageSourcePropType, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../theming';
import { MyText } from '@app/view/components/my-text';
import { Building, iconHeight, iconWidth, Tech, Unit } from '@nex/data';
import { FontAwesome5 } from '@expo/vector-icons';
import { getAbilityIcon } from '@app/view/components/tech-tree';
import { createStylesheet } from '../../theming-new';
import { openLink } from '../../helper/url';
import { Stack } from 'expo-router';
import { ScrollView } from '@app/components/scroll-view';
import { useVideoPlayer, VideoPlayer, VideoView } from 'expo-video';
import { Delayed } from '@app/view/components/delayed';
import { IGetTranslation, useTranslation } from '@app/helper/translate';

interface ITip {
    title: string;
    description: string;
    image?: ImageSourcePropType;
    video?: { uri: string };
    videoPoster?: ImageSourcePropType;
    unit?: Unit;
    building?: Building;
    tech?: Tech;
    url?: string;
    imageIcon?: string;
    icon?: string;
}

const videoBaseUrl = 'https://frontend.cdn.aoe2companion.com/public/aoe2/de/tips/video/';
const imageBaseUrl = 'https://frontend.cdn.aoe2companion.com/public/aoe2/de/tips/image/';

function getImageSource(name: string) {
    return { uri: imageBaseUrl + name };
}

function getVideoSource(name: string) {
    return { uri: videoBaseUrl + name };
}

function getTips(getTranslation: IGetTranslation): ITip[] {
    return [
        {
            title: getTranslation('tips.item.heading.gatheringefficiently'),
            description: getTranslation('tips.item.note.gatheringefficiently'),
            video: getVideoSource('aoe-sheep.mp4'),
            unit: 'Sheep',
        },
        {
            title: getTranslation('tips.item.heading.savevillagerfromboar'),
            description: getTranslation('tips.item.note.savevillagerfromboar'),
            video: getVideoSource('aoe-boar.mp4'),
            unit: 'Boar',
        },
        {
            title: getTranslation('tips.item.heading.autoscout'),
            description: getTranslation('tips.item.note.autoscout'),
            video: getVideoSource('aoe-auto-scout.mp4'),
            unit: 'ScoutCavalry',
        },
        {
            title: getTranslation('tips.item.heading.automaticfarmseeding'),
            description: getTranslation('tips.item.note.automaticfarmseeding'),
            video: getVideoSource('aoe-auto-seed.mp4'),
            building: 'Farm',
        },
        {
            title: getTranslation('tips.item.heading.rotategates'),
            description: getTranslation('tips.item.note.rotategates'),
            video: getVideoSource('aoe-gate.mp4'),
            building: 'PalisadeGate',
        },
        {
            title: getTranslation('tips.item.heading.taskqueue'),
            description: getTranslation('tips.item.note.taskqueue'),
            video: getVideoSource('aoe-task-queue.mp4'),
            imageIcon: require('../../../assets/tips/icon/aoe-task-queue.png'),
        },
        {
            title: getTranslation('tips.item.heading.farmingefficiently'),
            description: getTranslation('tips.item.note.farmingefficiently'),
            image: getImageSource('aoe-farm.webp'),
            building: 'Farm',
        },

        {
            title: getTranslation('tips.item.heading.smalltrees'),
            description: getTranslation('tips.item.note.smalltrees'),
            video: getVideoSource('aoe-small-trees.mp4'),
            url: 'https://www.ageofempires.com/mods/details/790',
            imageIcon: require('../../../assets/tips/icon/aoe-small-trees.png'),
        },
        {
            title: getTranslation('tips.item.heading.zetnusimprovedgridmod'),
            description: getTranslation('tips.item.note.zetnusimprovedgridmod'),
            image: getImageSource('aoe-grid.webp'),
            url: 'https://www.ageofempires.com/mods/details/812',
            imageIcon: require('../../../assets/tips/icon/aoe-grid.png'),
        },
        {
            title: getTranslation('tips.item.heading.idlevillagerpointer'),
            description: getTranslation('tips.item.note.idlevillagerpointer'),
            video: getVideoSource('aoe-idle-villager-pointer.mp4'),
            url: 'https://www.ageofempires.com/mods/details/2686',
            imageIcon: require('../../../assets/tips/icon/aoe-idle-villager-pointer.png'),
        },
        {
            title: getTranslation('tips.item.heading.idlevillagerhighlightbyarrow'),
            description: getTranslation('tips.item.note.idlevillagerhighlightbyarrow'),
            image: getImageSource('aoe-idle-villager-arrow.webp'),
            url: 'https://www.ageofempires.com/mods/details/3789',
            imageIcon: require('../../../assets/tips/icon/aoe-idle-villager-arrow.png'),
        },
        {
            title: getTranslation('tips.item.heading.nointro'),
            description: getTranslation('tips.item.note.nointro'),
            url: 'https://www.ageofempires.com/mods/details/2416',
            icon: 'video',
        },
        {
            title: getTranslation('tips.item.heading.hugenumber'),
            description: getTranslation('tips.item.note.hugenumber'),
            url: 'https://www.ageofempires.com/mods/details/1779',
            imageIcon: require('../../../assets/tips/icon/aoe-huge-number.png'),
        },
        {
            title: getTranslation('tips.item.heading.blacksmithupgrades'),
            description: getTranslation('tips.item.note.blacksmithupgrades'),
            building: 'Blacksmith',
        },
        {
            title: getTranslation('tips.item.heading.selectingallidlevillagers'),
            description: getTranslation('tips.item.note.selectingallidlevillagers'),
            unit: 'Villager',
        },
        {
            title: getTranslation('tips.item.heading.selectingalllandmilitaryunits'),
            description: getTranslation('tips.item.note.selectingalllandmilitaryunits'),
            unit: 'ManAtArms',
        },
        {
            title: getTranslation('tips.item.heading.donotstockpileresources'),
            description: getTranslation('tips.item.note.donotstockpileresources'),
            imageIcon: require('../../../assets/other/Gold.png'),
        },
    ];
}

function getTipStyle(active: boolean, status: string) {
    if (Platform.OS === 'web') {
        return {
            zIndex: active && status === 'readyToPlay' ? 1 : 0,
        };
    }
    return {
        transform: [{ translateX: active && status === 'readyToPlay' ? 0 : 10000 }],
        zIndex: 1,
    };
}

function VideoTip(props: any) {
    const { tip, active } = props;
    const styles = useStyles();
    const [status, setStatus] = useState('loading');
    // const [time, setTime] = useState(0);
    // const durationRef = useRef(0);

    const setup = (player: VideoPlayer) => {
        // console.log('player', player);
        player.muted = true;
        player.allowsExternalPlayback = false;
        player.loop = true;
        player.addListener('statusChange', (status) => {
            // console.log(tip.video.uri.replace(videoBaseUrl, ''), status.status);
            setStatus(status.status);
            // if (status.status === 'readyToPlay' && durationRef.current === 0) {
            //     console.log('duration', player.duration);
            //     durationRef.current = player.duration;
            // }
        });
    };

    // useInterval(() => {
    //     setTime(player.currentTime / durationRef.current * 100);
    //     // console.log('time', player.currentTime, durationRef.current);
    // }, 25);

    const player = useVideoPlayer(tip.video, setup);

    useEffect(() => {
        // console.log(tip.video.uri.replace(videoBaseUrl, ''), active, status, player.playing);
        if (active && status === 'readyToPlay' && !player.playing) {
            // console.log(tip.video.uri.replace(videoBaseUrl, ''), 'REPLAY');
            player.play();
        }
    }, [player, active, status]);

    useEffect(() => {
        if (!active) {
            player.pause();
            player.currentTime = 0;
        }
    }, [player, active]);

    return (
        <>
            <VideoView
                nativeControls={false}
                player={player}
                style={[
                    styles.showcase,
                    getTipStyle(active, status),
                    {
                        width: '100%',
                        aspectRatio: 16 / 9,
                        height: Platform.OS === 'web' ? 252 : undefined,
                    },
                ]}
            />
            {/*<View style={{*/}
            {/*    backgroundColor: '#C00',*/}
            {/*    width: time + '%',*/}
            {/*    height: 5,*/}
            {/*    position: 'absolute',*/}
            {/*    bottom: 0,*/}
            {/*    left: 0,*/}
            {/*    zIndex: 100,*/}
            {/*}}></View>*/}
        </>
    );
}

function ImageTip(props: any) {
    const { tip, active } = props;
    const styles = useStyles();

    return (
        <Image
            source={tip.image}
            style={[
                styles.showcase,
                getTipStyle(active, 'readyToPlay'),
                {
                    width: '100%',
                    aspectRatio: 16 / 9,
                },
            ]}
        />
    );
}

function NoPreviewTip(props: any) {
    const { active } = props;
    const styles = useStyles();

    return (
        <View
            style={[
                styles.showcase,
                getTipStyle(active, 'readyToPlay'),
                {
                    width: '100%',
                    aspectRatio: 16 / 9,
                },
            ]}
        >
            <MyText>No Preview</MyText>
        </View>
    );
}

export default function TipsPage() {
    const styles = useStyles();
    const theme = useAppTheme();
    const getTranslation = useTranslation();
    const tips = getTips(getTranslation);
    const [currentTip, setCurrentTip] = useState(tips[0]);

    const onOpen = async (tip: any) => {
        await openLink(tip.url);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Tips' }} />
            <View style={styles.showcaseContainer}>
                <View style={styles.showcaseInner}>
                    <Image
                        source={require('../../../assets/tips/poster/aoe-sheep.webp')}
                        style={[
                            styles.showcase,
                            {
                                width: '100%',
                                height: 'auto',
                                aspectRatio: 16 / 9,
                                opacity: 1,
                                zIndex: 1,
                            },
                        ]}
                    />
                    {tips.map((tip, i) => (
                        <Delayed key={i} delay={i * 100}>
                            {tip.video && <VideoTip tip={tip} active={tip === currentTip} />}
                            {tip.image && <ImageTip tip={tip} active={tip === currentTip} />}
                            {!tip.video && !tip.image && <NoPreviewTip tip={tip} active={tip === currentTip} />}
                        </Delayed>
                    ))}
                </View>
            </View>
            <ScrollView style={styles.container} contentContainerStyle="pb-4">
                {tips.map((tip) => (
                    <View key={tip.title} style={styles.row}>
                        <TouchableOpacity style={styles.tip} onPress={() => setCurrentTip(tip)}>
                            <View style={styles.rowInner}>
                                {tip.icon && (
                                    <View style={styles.unitIconBig}>
                                        <FontAwesome5 name="video" size={14} color={theme.textNoteColor} />
                                    </View>
                                )}
                                {!tip.icon && <Image style={styles.unitIconBig} source={tip.imageIcon ? tip.imageIcon : getAbilityIcon(tip)} />}
                                <View style={styles.textContainer}>
                                    <MyText style={[styles.title, { fontWeight: currentTip.title === tip.title ? 'bold' : 'normal' }]}>
                                        {tip.title}
                                    </MyText>
                                    <MyText style={styles.description}>{tip.description}</MyText>
                                </View>
                            </View>
                        </TouchableOpacity>
                        {tip.url && (
                            <TouchableOpacity style={styles.action} onPress={() => onOpen(tip)}>
                                <FontAwesome5 name="external-link-square-alt" size={14} color={theme.textNoteColor} />
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        content: {},
        showcase: {
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            backgroundColor: theme.backgroundColor,
        },
        showcaseContainer: {
            // borderTopWidth: 0,
            // borderTopColor: theme.borderColor,
            borderBottomWidth: 2,
            borderBottomColor: theme.borderColor,
        },
        showcaseInner: {
            width: '100%',
            aspectRatio: 16 / 9,
        },
        textContainer: {
            flex: 1,
        },
        action: {
            paddingHorizontal: 15,
        },
        tip: {
            flex: 1,
        },
        unitIconBig: {
            alignItems: 'center',
            justifyContent: 'center',
            width: iconWidth,
            height: iconHeight,
            marginLeft: 5,
            marginRight: 15,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: theme.lightBorderColor,
        },
        rowInner: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            // paddingLeft: 15,
        },
        title: {
            lineHeight: 18,
        },
        description: {
            color: theme.textNoteColor,
            lineHeight: 16,
            fontSize: 12,
        },
    } as const)
);
