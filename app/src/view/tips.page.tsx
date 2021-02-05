import React, {useState} from 'react';
import {
    Image, ImageSourcePropType, Linking, Platform, ScrollView, Share, StyleSheet, TouchableOpacity, View
} from 'react-native';
import {makeVariants, useAppTheme, useTheme} from "../theming";
import {MyText} from "./components/my-text";
import {Video} from "expo-av";
import {Building, iconHeight, iconWidth, Tech, Unit} from "@nex/data";
import IconFA5 from "react-native-vector-icons/FontAwesome5";
import {AVPlaybackSource} from "expo-av/build/AV";
import {getAbilityIcon} from "./components/tech-tree";
import ImageSized from "./components/image-sized";
import {createStylesheet} from '../theming-new';
import {getTranslation} from '../helper/translate';

interface ITip {
    title: string;
    description: string;
    image?: ImageSourcePropType;
    video?: AVPlaybackSource;
    videoPoster?: ImageSourcePropType;
    unit?: Unit;
    building?: Building;
    tech?: Tech;
    url?: string;
    imageIcon?: string;
    icon?: string;
}

const videoBaseUrl = 'https://firebasestorage.googleapis.com/v0/b/aoe2companion.appspot.com/o/tips%2Fvideo%2F';
const imageBaseUrl = 'https://firebasestorage.googleapis.com/v0/b/aoe2companion.appspot.com/o/tips%2Fimage%2F';

function getImageSource(name: string) {
    return { uri: imageBaseUrl + name + '?alt=media' };
}

function getVideoSource(name: string) {
    return { uri: videoBaseUrl + name + '?alt=media' };
}

const tips: ITip[] = [
    // {
    //     title: 'Defend the drush',
    //     description: 'Move villagers into town center and do quick-walls to win.',
    //     video: require('../../assets/tips/aoe-1.mp4'),
    //     video: getVideoUrl('http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'),
    //     url: 'https://www.ageofempires.com/mods/details/2695',
    // },
    {
        title: getTranslation('tips.item.heading.gatheringefficiently'),
        description: getTranslation('tips.item.note.gatheringefficiently'),
        video: getVideoSource('aoe-sheep.mp4'),
        videoPoster: require('../../assets/tips/poster/aoe-sheep.png'),
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
        imageIcon: require('../../assets/tips/icon/aoe-task-queue.png'),
    },
    {
        title: getTranslation('tips.item.heading.farmingefficiently'),
        description: getTranslation('tips.item.note.farmingefficiently'),
        image: getImageSource('aoe-farm.png'),
        building: 'Farm',
    },

    {
        title: getTranslation('tips.item.heading.smalltrees'),
        description: getTranslation('tips.item.note.smalltrees'),
        video: getVideoSource('aoe-small-trees.mp4'),
        url: 'https://www.ageofempires.com/mods/details/790',
        imageIcon: require('../../assets/tips/icon/aoe-small-trees.png'),
    },
    {
        title: getTranslation('tips.item.heading.zetnusimprovedgridmod'),
        description: getTranslation('tips.item.note.zetnusimprovedgridmod'),
        image: getImageSource('aoe-grid.png'),
        url: 'https://www.ageofempires.com/mods/details/812',
        imageIcon: require('../../assets/tips/icon/aoe-grid.png'),
    },
    {
        title: getTranslation('tips.item.heading.idlevillagerpointer'),
        description: getTranslation('tips.item.note.idlevillagerpointer'),
        video: getVideoSource('aoe-idle-villager-pointer.mp4'),
        url: 'https://www.ageofempires.com/mods/details/2686',
        imageIcon: require('../../assets/tips/icon/aoe-idle-villager-pointer.png'),
    },
    {
        title: getTranslation('tips.item.heading.idlevillagerhighlightbyarrow'),
        description: getTranslation('tips.item.note.idlevillagerhighlightbyarrow'),
        image: getImageSource('aoe-idle-villager-arrow.png'),
        url: 'https://www.ageofempires.com/mods/details/3789',
        imageIcon: require('../../assets/tips/icon/aoe-idle-villager-arrow.png'),
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
        imageIcon: require('../../assets/tips/icon/aoe-huge-number.png'),
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
        imageIcon: require('../../assets/other/Gold.png'),
    },
];

// function WebAspectView(props: any) {
//     const [layout, setLayout] = React.useState(null);
//
//     if (Platform.OS !== 'web') return props.children;
//
//     const { aspectRatio = 1, ...inputStyle } =
//     StyleSheet.flatten(props.style) || {};
//     const style = [inputStyle, { aspectRatio }];
//
//     if (layout) {
//         const { width = 0, height = 0 } = layout;
//         console.log('WIDTH', width);
//         if (width === 0) {
//             style.push({ width: height * aspectRatio, height });
//         } else {
//             style.push({ width, height: width / aspectRatio });
//         }
//     }
//
//     return (
//         <View
//             {...props}
//             style={style}
//             onLayout={({ nativeEvent: { layout } }) => setLayout(layout)}
//         />
//     );
// }

export default function TipsPage() {
    const styles = useStyles();
    const theme = useAppTheme();
    const [currentTip, setCurrentTip] = useState(tips[0]);
    const [loading, setLoading] = useState(true);
    const [videoPosition, setVideoPosition] = useState(0);

    const onShare = async (tip: any) => {
        try {
            const result = await Share.share({
                message: tip.url, // android
                url: tip.url, // ios
                // title: tip.title,
            }, {
                subject: tip.title,
                // dialogTitle: tip.title,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const onOpen = async (tip: any) => {
        await Linking.openURL(tip.url);
    };

    const setTip = (tip: ITip) => {
        setCurrentTip(tip);
        setVideoPosition(0);
    };

    return (
        <View style={styles.container}>
            <View style={styles.showcaseContainer}>
            <View style={styles.showcaseInner}>
            {
                !currentTip.video && !currentTip.image &&
                    <View style={[styles.showcase, { width: '100%', aspectRatio: 16/9, opacity: loading ? 0.5 : 1 }]}>
                        <MyText>No Preview</MyText>
                    </View>
            }
            {
                currentTip.video &&
                <Video
                    source={currentTip.video}
                    posterSource={currentTip.videoPoster}
                    usePoster={true}
                    // source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                    isMuted={true}
                    resizeMode="cover"
                    shouldPlay={true}
                    // shouldPlay={false}
                    positionMillis={videoPosition}
                    isLooping
                    onLoad={() => setLoading(false)}
                    onLoadStart={() => setLoading(true)}
                    style={[styles.showcase, { width: '100%', aspectRatio: 16/9, opacity: loading ? 0.5 : 1, height: Platform.OS === 'web' ? 252 : undefined }]}
                />
            }
            {
                currentTip.image &&
                    <ImageSized source={currentTip.image} style={[styles.showcase, { width: '100%', aspectRatio: 16/9, opacity: loading ? 0.5 : 1 }]} />
            }
            </View>
            </View>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}>
                {
                    tips.map(tip =>
                        <View key={tip.title} style={styles.row}>
                            <TouchableOpacity style={styles.tip} onPress={() => setTip(tip)}>
                                <View style={styles.rowInner}>
                                    {
                                        tip.icon &&
                                        <View style={styles.unitIconBig}>
                                            <IconFA5  name="video" size={14} color={theme.textNoteColor} />
                                        </View>
                                    }
                                    {
                                        !tip.icon &&
                                        <Image fadeDuration={0} style={styles.unitIconBig} source={tip.imageIcon ? tip.imageIcon : getAbilityIcon(tip)}/>
                                    }
                                    <View style={styles.textContainer}>
                                        <MyText style={[styles.title, {fontWeight: currentTip.title == tip.title ? 'bold' : 'normal'}]}>{tip.title}</MyText>
                                        <MyText style={styles.description}>{tip.description}</MyText>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            {
                                tip.url &&
                                <TouchableOpacity style={styles.action} onPress={() => onOpen(tip)}>
                                    {/*<IconFA5 name="share-square" size={14} color={theme.textNoteColor} />*/}
                                    {/*<IconFA5 name="external-link-alt" size={14} color={theme.textNoteColor} />*/}
                                    <IconFA5 name="external-link-square-alt" size={14} color={theme.textNoteColor} />
                                </TouchableOpacity>
                            }
                        </View>
                    )
                }
            </ScrollView>
        </View>
    );
}


const useStyles = createStylesheet(theme => StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {

    },
    showcase: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    showcaseContainer: {
        borderTopWidth: 2,
        borderTopColor: theme.borderColor,
        borderBottomWidth: 2,
        borderBottomColor: theme.borderColor,
    },
    showcaseInner: {
        width: '100%',
        aspectRatio: 16/9,
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
        borderBottomColor: theme.borderColor,
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
}));
