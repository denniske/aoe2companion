import React from 'react';
import { FlatList, StyleSheet, View, ViewStyle } from 'react-native';
import { MyText } from '@app/view/components/my-text';
import { changelog, changelog4, IChange } from '../../changelog';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../App2';
import { lt } from 'semver';
import { createStylesheet } from '../../theming-new';
import { useSelector } from '../../redux/reducer';
import { moProfileId } from '@nex/data';
import { useTheme } from '../../theming';
import { appVariants } from '../../styles';
import { isElectron } from '../../helper/electron';
import { openLink } from '../../helper/url';
import { appConfig } from '@nex/dataset';

interface IChangelogEntry {
    version: string;
    changes: IChange[];
}

export default function ChangelogPage() {
    const appStyles = useTheme(appVariants);
    const styles = useStyles();
    const route = useRoute<RouteProp<RootStackParamList, 'Changelog'>>();
    const changelogLastVersionRead = route.params?.changelogLastVersionRead;
    const auth = useSelector((state) => state.auth);

    const labelStyle = (change: IChange): ViewStyle => {
        const colors = {
            feature: '#51A451',
            minor: '#F6C344',
            bugfix: '#44B3F6',
        };
        return {
            backgroundColor: colors[change.type],
        };
    };

    const newStyle = (): ViewStyle => {
        return {
            backgroundColor: 'orange',
        };
    };

    const formatTitle = (title: string) => {
        const parts = title.split(/(\[.+]\([^)]+\))/);

        const texts = [];
        for (let i = 0; i < parts.length; i++) {
            if (i % 2 == 0) {
                texts.push(<MyText key={i}>{parts[i]}</MyText>);
            } else {
                const match = parts[i].match(/\[(.+)]\((.+)\)/);
                const [all, text, url] = match || [];
                texts.push(
                    <MyText key={i} style={appStyles.link} onPress={() => openLink(url)}>
                        {text}
                    </MyText>
                );
            }
        }
        return texts;
    };

    const renderItem = ({ version, changes }: IChangelogEntry) => (
        <View key={version}>
            <View style={styles.row}>
                <MyText style={styles.heading}>Version {version}</MyText>
                {changelogLastVersionRead && lt(changelogLastVersionRead, version) && <MyText style={styles.headingNote}> (new)</MyText>}
            </View>

            {version === '21.0.8' && auth?.profile_id === moProfileId && (
                <View style={styles.row}>
                    <View style={[styles.labelContainer, labelStyle({ type: 'feature', title: '' })]}>
                        <MyText style={styles.label}>feature</MyText>
                    </View>
                    <View style={styles.textContainer}>
                        <MyText style={styles.title}>Prepare for Sihing Mo's birthday</MyText>
                        <MyText style={styles.content}> </MyText>
                    </View>
                </View>
            )}

            {changes.map((change) => (
                <View key={change.title} style={styles.row}>
                    <View style={[styles.labelContainer, labelStyle(change)]}>
                        <MyText style={styles.label}>{change.type}</MyText>
                    </View>
                    <View style={styles.textContainer}>
                        <MyText style={styles.title}>{formatTitle(change.title)}</MyText>
                        {change.content && <MyText style={styles.content2}>{change.content}</MyText>}
                        {
                            change.author && <MyText style={styles.content}>by {formatTitle(change.author)}</MyText>
                            // <MyText style={styles.content}>(by {formatTitle(change.author)})</MyText>
                        }
                    </View>
                </View>
            ))}
        </View>
    );

    const changelogEntries = Object.entries(appConfig.game === 'aoe2de' ? changelog : changelog4).map(([version, changes]) => ({ version, changes }));
    const filteredChangelogEntries = isElectron() ? changelogEntries : changelogEntries.filter((e) => !e.version.includes('+'));

    return (
        <FlatList
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps={'always'}
            data={filteredChangelogEntries}
            renderItem={({ item, index }) => renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
        />
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        textContainer: {
            flex: 1,
            marginTop: 2,
        },
        row: {
            flexDirection: 'row',
            marginBottom: 4,
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
            marginTop: 10,
            fontWeight: 'bold',
            marginBottom: 10,
        },
        headingNote: {
            marginTop: 12,
            fontWeight: 'bold',
            marginBottom: 10,
            fontSize: 12,
            color: theme.textNoteColor,
        },
        title: {
            fontWeight: '500',
            marginBottom: 5,
            lineHeight: 18,
        },
        content: {
            marginBottom: 5,
            lineHeight: 18,
            fontStyle: 'italic',
        },
        content2: {
            marginBottom: 5,
            lineHeight: 18,
        },
        container: {
            minHeight: '100%',
            padding: 20,
            paddingTop: 10,
        },
    })
);
