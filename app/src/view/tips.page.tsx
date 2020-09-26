import React, {useState} from 'react';
import {Image, ImageSourcePropType, Linking, ScrollView, Share, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ITheme, makeVariants, useAppTheme, useTheme} from "../theming";
import {MyText} from "./components/my-text";
import {Video} from "expo-av";
import {Building, iconHeight, iconWidth, Tech, Unit} from "@nex/data";
import IconFA5 from "react-native-vector-icons/FontAwesome5";
import {AVPlaybackSource} from "expo-av/build/AV";
import {getAbilityIcon} from "./components/tech-tree";
import ImageSized from "./components/image-sized";

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
        title: 'Gathering efficiently',
        description: 'Shift + Right Click new sheep',
        video: getVideoSource('aoe-sheep.mp4'),
        videoPoster: require('../../assets/tips/poster/aoe-sheep.png'),
        unit: 'Sheep',
    },
    {
        title: 'Save villager from boar',
        description: 'Build house to distract the boar',
        video: getVideoSource('aoe-boar.mp4'),
        unit: 'Boar',
    },
    {
        title: 'Autoscout',
        description: 'Use auto scout to use AI scouting',
        video: getVideoSource('aoe-auto-scout.mp4'),
        unit: 'ScoutCavalry',
    },
    {
        title: 'Automatic farm seeding',
        description: 'Use auto seed to automatically seed new farms',
        video: getVideoSource('aoe-auto-seed.mp4'),
        building: 'Farm',
    },
    {
        title: 'Rotate Gates',
        description: 'Use Control + Scroll to rotate gates',
        video: getVideoSource('aoe-gate.mp4'),
        building: 'PalisadeGate',
    },
    {
        title: 'Task Queue',
        description: 'Use Shift + Right Click to queue up tasks',
        video: getVideoSource('aoe-task-queue.mp4'),
        imageIcon: require('../../assets/tips/icon/aoe-task-queue.png'),
    },
    {
        title: 'Farming efficiently',
        description: 'Build farms in circle around mill and town center.',
        image: getImageSource('aoe-farm.png'),
        building: 'Farm',
    },

    {
        title: 'Small Trees',
        description: 'Replaces trees with a smaller version. Gives better overview and makes it easier to detect holes.',
        video: getVideoSource('aoe-small-trees.mp4'),
        url: 'https://www.ageofempires.com/mods/details/790',
        imageIcon: require('../../assets/tips/icon/aoe-small-trees.png'),
    },
    {
        title: 'Zetnus Improved Grid Mod',
        description: 'Shows a grid on the terrain. Makes it easier to place buildings and measure distances. More subtle than the integrated grid.',
        image: getImageSource('aoe-grid.png'),
        url: 'https://www.ageofempires.com/mods/details/812',
        imageIcon: require('../../assets/tips/icon/aoe-grid.png'),
    },
    {
        title: 'Idle Villager Pointer (UHD supported)',
        description: 'Adds an exclamation point over all idle villagers making it easier for you to identify them.',
        video: getVideoSource('aoe-idle-villager-pointer.mp4'),
        url: 'https://www.ageofempires.com/mods/details/2686',
        imageIcon: require('../../assets/tips/icon/aoe-idle-villager-pointer.png'),
    },
    {
        title: 'Idle Villager highlight by arrow',
        description: 'Highlights the idle villager button by adding a red arrow underneath.',
        image: getImageSource('aoe-idle-villager-arrow.png'),
        url: 'https://www.ageofempires.com/mods/details/3789',
        imageIcon: require('../../assets/tips/icon/aoe-idle-villager-arrow.png'),
    },
    {
        title: 'No Intro',
        description: 'Replaces the intro video with a 0.2s long blank video to effectively skip the intro video every time.',
        url: 'https://www.ageofempires.com/mods/details/2416',
        icon: 'video',
    },
    {
        title: 'Huge Number',
        description: 'Increases control group numbers up to 50% for an optimal visibility.',
        url: 'https://www.ageofempires.com/mods/details/1779',
        imageIcon: require('../../assets/tips/icon/aoe-huge-number.png'),
    },
    {
        title: 'Blacksmith Upgrades',
        description: 'For Archers always buy the attack upgrades first. For Infantry and Cavarly always buy the defence upgrades first.',
        building: 'Blacksmith',
    },
    {
        title: 'Selecting all Idle Villagers',
        description: 'Use Shift + . to select all idle villagers.',
        unit: 'Villager',
    },
    {
        title: 'Selecting all Land Military Units',
        description: 'Use Shift + , to select all land military units.',
        unit: 'ManAtArms',
    },
    {
        title: 'Do not stockpile Resources',
        description: 'Always try to spend the resources you have, with the exception of saving resources to advance to the next age.',
        imageIcon: require('../../assets/other/Gold.png'),
    },
];

export default function TipsPage() {
    const styles = useTheme(variants);
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
                        style={[styles.showcase, { width: '100%', aspectRatio: 16/9, opacity: loading ? 0.5 : 1 }]}
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
                                        <Image style={styles.unitIconBig} source={tip.imageIcon ? tip.imageIcon : getAbilityIcon(tip)}/>
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


const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
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
    });
};

const variants = makeVariants(getStyles);
