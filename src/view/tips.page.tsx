import React, {useState} from 'react';
import {Image, ImageSourcePropType, ScrollView, Share, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ITheme, makeVariants, useAppTheme, useTheme} from "../theming";
import {MyText} from "./components/my-text";
import {Video} from "expo-av";
import {getUnitIcon, Unit} from "../helper/units";
import {iconHeight, iconWidth} from "../helper/theme";
import IconFA5 from "react-native-vector-icons/FontAwesome5";
import {AVPlaybackSource} from "expo-av/build/AV";
import {Building} from "../helper/buildings";
import {Tech} from "../helper/techs";
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
}

const tips: ITip[] = [
    // {
    //     title: 'Defend the drush',
    //     description: 'Move villagers into town center and do quick-walls to win.',
    //     // video: require('../../assets/tips/aoe-1.mp4'),
    //     video: { uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' },
    //     url: 'https://www.ageofempires.com/mods/details/2695',
    // },

    {
        title: 'Gathering efficiently',
        description: 'Shift-Right Click new sheep.',
        video: require('../../assets/tips/aoe-sheep.mp4'),
        videoPoster: require('../../assets/tips/aoe-sheep.png'),
        // video: { uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' },
        unit: 'Sheep',
    },
    {
        title: 'Save villager from boar',
        description: 'Build house to distract boar.',
        video: require('../../assets/tips/aoe-boar.mp4'),
        videoPoster: require('../../assets/tips/aoe-boar.png'),
        // video: { uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' },
        unit: 'Boar',
    },

    {
        title: 'Autoscout',
        description: 'Use autoscout to automatically scout',
        video: require('../../assets/tips/aoe-auto-scout.mp4'),
        unit: 'ScoutCavalry',
        // tech: 'Cartography',
    },
    {
        title: 'Automatic farm seeding',
        description: 'Use auto seed to automatically seed new farms',
        video: require('../../assets/tips/aoe-auto-seed.mp4'),
        building: 'Farm',
    },
    {
        title: 'Rotate Gates',
        description: 'Use Control-Scroll to rotate gates',
        video: require('../../assets/tips/aoe-gate.mp4'),
        building: 'PalisadeGate',
    },
    {
        title: 'Task Queue',
        description: 'Use shift click to queue up tasks',
        video: require('../../assets/tips/aoe-task-queue.mp4'),
    },

    {
        title: 'Farming efficiently',
        description: 'Build farms in circle around mill and town center.',
        image: require('../../assets/tips/aoe-farm.png'),
        building: 'Farm',
    },

    {
        title: 'Small Trees',
        description: 'Replaces trees with a smaller version. Gives better overview and makes it easier to detect holes.',
        video: require('../../assets/tips/aoe-small-trees.mp4'),
        url: 'https://www.ageofempires.com/mods/details/790',
    },
    {
        title: 'Zetnus Improved Grid Mod',
        description: 'Shows a grid on the terrain. Makes it easier to place buildings and measure distances. More subtle than the integrated grid mod.',
        image: require('../../assets/tips/aoe-grid.png'),
        url: 'https://www.ageofempires.com/mods/details/812',
    },
    {
        title: 'Idle Villager Pointer (UHD supported)',
        description: 'Adds an exclamation point over all idle villagers making it easier for you to identify them.',
        video: require('../../assets/tips/aoe-idle-villager-pointer.mp4'),
        url: 'https://www.ageofempires.com/mods/details/2686',
    },
    {
        title: 'Idle Villager highlight by arrow',
        description: 'Highlights the idle villager button by adding a red arrow underneath.',
        image: require('../../assets/tips/aoe-idle-villager-arrow.png'),
        url: 'https://www.ageofempires.com/mods/details/3789',
    },
    {
        title: 'No Intro',
        description: 'Replaces the intro video with a 0.2s long blank video to effectively skip the intro video every time.',
        // video: require('../../assets/tips/aoe-2.mp4'),
        video: { uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' },
        url: 'https://www.ageofempires.com/mods/details/2416',
    },
    {
        title: 'Huge Number',
        description: 'Increases control group numbers up to 50% for an optimal visibility.',
        // video: require('../../assets/tips/aoe-2.mp4'),
        video: { uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' },
        url: 'https://www.ageofempires.com/mods/details/1779',
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

    const setTip = (tip: ITip) => {
        setCurrentTip(tip);
        setVideoPosition(0);
    };

    return (
        <View style={styles.container}>
            {
                currentTip.video &&
                <View style={styles.showcaseContainer}>
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
                </View>
            }
            {
                currentTip.image &&
                <View style={styles.showcaseContainer}>
                    <ImageSized source={currentTip.image}
                       style={[styles.showcase, { width: '100%', aspectRatio: 16/9, opacity: loading ? 0.5 : 1 }]} />
                </View>
            }
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}>
                {
                    tips.map(tip =>
                        <View key={tip.title} style={styles.row}>
                            <TouchableOpacity style={styles.tip} onPress={() => setTip(tip)}>
                                <View style={styles.rowInner}>
                                    <Image style={styles.unitIconBig} source={getAbilityIcon(tip)}/>
                                    <View style={styles.textContainer}>
                                        <MyText style={[styles.title, {fontWeight: currentTip.title == tip.title ? 'bold' : 'normal'}]}>{tip.title}</MyText>
                                        <MyText style={styles.description}>{tip.description}</MyText>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            {
                                tip.url &&
                                <TouchableOpacity style={styles.action} onPress={() => onShare(tip)}>
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
        },
        showcaseContainer: {
            borderTopWidth: 2,
            borderTopColor: theme.borderColor,
            borderBottomWidth: 2,
            borderBottomColor: theme.borderColor,
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
