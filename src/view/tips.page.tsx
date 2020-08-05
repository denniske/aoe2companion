import React, {useState} from 'react';
import {Image, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ITheme, makeVariants, useAppTheme, useTheme} from "../theming";
import {MyText} from "./components/my-text";
import {Video} from "expo-av";
import {getUnitIcon} from "../helper/units";
import {iconHeight, iconWidth} from "../helper/theme";


const tips = [
    {
        title: 'Defend the drush',
        description: 'Move villagers into town center and do quick-walls to win.',
        // video: require('../../assets/tips/aoe-1.mp4'),
        video: { uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' },
    },
    {
        title: 'Farming efficiently',
        description: 'Build farms in circle around mill and town center.',
        // video: require('../../assets/tips/aoe-2.mp4'),
        video: { uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' },
    },
    {
        title: 'Farming efficiently1',
        description: 'Build farms in circle around mill and town center.',
        // video: require('../../assets/tips/aoe-2.mp4'),
        video: { uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' },
    },
    {
        title: 'Farming efficiently2',
        description: 'Build farms in circle around mill and town center.',
        // video: require('../../assets/tips/aoe-2.mp4'),
        video: { uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' },
    },
    {
        title: 'Farming efficiently3',
        description: 'Build farms in circle around mill and town center.',
        // video: require('../../assets/tips/aoe-2.mp4'),
        video: { uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' },
    },
    {
        title: 'Farming efficiently4',
        description: 'Build farms in circle around mill and town center.',
        // video: require('../../assets/tips/aoe-2.mp4'),
        video: { uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' },
    },
    {
        title: 'Farming efficiently5',
        description: 'Build farms in circle around mill and town center.',
        // video: require('../../assets/tips/aoe-2.mp4'),
        video: { uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' },
    },
    {
        title: 'Farming efficiently6',
        description: 'Build farms in circle around mill and town center.',
        // video: require('../../assets/tips/aoe-2.mp4'),
        video: { uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' },
    },
    {
        title: 'Farming efficiently7',
        description: 'Build farms in circle around mill and town center.',
        // video: require('../../assets/tips/aoe-2.mp4'),
        video: { uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' },
    },
    {
        title: 'Farming efficiently8',
        description: 'Build farms in circle around mill and town center.',
        // video: require('../../assets/tips/aoe-2.mp4'),
        video: { uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' },
    },
    {
        title: 'Farming efficiently9',
        description: 'Build farms in circle around mill and town center.',
        // video: require('../../assets/tips/aoe-2.mp4'),
        video: { uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' },
    },
];

export default function TipsPage() {
    const styles = useTheme(variants);
    const theme = useAppTheme();
    const [currentTip, setCurrentTip] = useState(tips[0]);
    const [loading, setLoading] = useState(true);

    return (
        <View style={styles.container}>
            <Video
                source={currentTip.video}
                // source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                isMuted={true}
                resizeMode="cover"
                shouldPlay
                isLooping
                onLoad={() => setLoading(false)}
                onLoadStart={() => setLoading(true)}
                style={{ width: '100%', aspectRatio: 16/9, opacity: loading ? 0.5 : 1 }}
            />
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}>
                {
                    tips.map(tip =>
                        <TouchableOpacity key={tip.title} onPress={() => setCurrentTip(tip)}>
                            <View style={styles.row}>
                                <Image style={styles.unitIconBig} source={getUnitIcon('Militia')}/>
                                <View style={styles.textContainer}>
                                    <MyText style={[styles.title, {fontWeight: currentTip == tip ? 'bold' : 'normal'}]}>{tip.title}</MyText>
                                    <MyText style={styles.description}>{tip.description}</MyText>
                                </View>
                            </View>
                        </TouchableOpacity>
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
        textContainer: {
            flex: 1,
        },
        unitIconBig: {
            width: iconWidth,
            height: iconHeight,
            marginRight: 10,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
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
