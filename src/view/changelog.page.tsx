import React from 'react';
import {ScrollView, StyleSheet, View, ViewStyle} from 'react-native';
import {MyText} from "./components/my-text";
import {ITheme, makeVariants, useTheme} from "../theming";
import {changelog, IChange} from "../changelog";


export default function ChangelogPage() {
    const styles = useTheme(variants);

    const labelStyle = (change: IChange): ViewStyle => {
        const colors = {
            'feature': '#51A451',
            'minor': '#F6C344',
            'bugfix': '#44B3F6',
        }
        return {
            backgroundColor: colors[change.type],
        };
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {
                Object.entries(changelog).map(([version, changes]) =>
                    <View key={version}>
                        <MyText style={styles.heading}>Version {version}</MyText>
                        {
                            changes.map(change =>
                                <View key={change.title} style={styles.row}>
                                    <View style={[styles.labelContainer, labelStyle(change)]}><MyText
                                        style={styles.label}>{change.type}</MyText></View>
                                    <View style={styles.textContainer}>
                                        <MyText style={styles.title}>{change.title}</MyText>
                                        <MyText style={styles.content}>{change.content}</MyText>
                                    </View>
                                </View>
                            )
                        }
                    </View>
                )
            }

            {/*<ImageSized source={require('../../assets/changelog/leader.png')} style={{width: '50%'}} />*/}
            {/*<ImageSized source={{uri: 'https://media.giphy.com/media/xUOxf34uHq8VolxF7y/giphy.gif'}} style={{width: 300, height: 300}} />*/}
        </ScrollView>
    );
}

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        textContainer: {
            flex: 1,
            marginTop: 2,
        },
        row: {
            flexDirection: 'row',
        },
        label: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 13,
        },
        labelContainer: {
            alignItems: 'center',
            padding: 3,
            borderRadius: 10,
            width: 90,
            alignSelf: 'flex-start',
            marginRight: 15,
        },
        heading: {
            marginTop: 20,
            fontWeight: 'bold',
            marginBottom: 10,
        },
        title: {
            fontWeight: '500',
            marginBottom: 5,
            lineHeight: 18,
        },
        content: {
            marginBottom: 5,
            lineHeight: 18,
        },
        container: {
            minHeight: '100%',
            // alignItems: 'center',
            padding: 20,
            paddingTop: 0,
        },
    });
};

const variants = makeVariants(getStyles);
