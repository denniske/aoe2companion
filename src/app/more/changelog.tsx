import React from 'react';
import { View, ViewStyle } from 'react-native';
import { MyText } from '@app/view/components/my-text';
import { lt } from 'semver';
import { useTheme } from '../../theming';
import { appVariants } from '../../styles';
import { openLink } from '../../helper/url';
import { appConfig } from '@nex/dataset';
import { Stack, useLocalSearchParams } from 'expo-router';
import { FlatList } from '@app/components/flat-list';
import { useTranslation } from '@app/helper/translate';
import { changelog, changelog4, IChange } from '@app/changelog';
import { Text } from '@app/components/text';

interface IChangelogEntry {
    version: string;
    changes: IChange[];
}

export type IChangelogPageParams = {
    changelogLastVersionRead?: string
}

export default function ChangelogPage() {
    const getTranslation = useTranslation();
    const appStyles = useTheme(appVariants);
    const { changelogLastVersionRead } = useLocalSearchParams<IChangelogPageParams>();

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
        <View key={version} className="my-2 gap-y-2">
            <View className="flex-row gap-y-2">
                <Text variant="header-xs">Version {version}</Text>
                {changelogLastVersionRead && lt(changelogLastVersionRead, version) && <Text variant="header-xs" color="subtle"> (new)</Text>}
            </View>
            <View className="gap-y-2">
                {changes.map((change) => (
                    <View key={change.title} className="flex-row gap-x-3">
                        <View style={labelStyle(change)} className="self-start items-center px-2 py-0 w-[90px] rounded-full">
                            <Text variant="header-xs" color="white" className="!text-[13px]">{change.type}</Text>
                        </View>
                        <View className="flex-1">
                            <Text variant="label">{formatTitle(change.title)}</Text>
                            {change.content && <Text>{formatTitle(change.content)}</Text>}
                            {
                                change.author && <Text className="italic">by {formatTitle(change.author)}</Text>
                            }
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );

    const changelogEntries = Object.entries(appConfig.game === 'aoe2' ? changelog : changelog4).map(([version, changes]) => ({ version, changes }));
    const filteredChangelogEntries = changelogEntries.filter((e) => !e.version.includes('+'));

    return (
        <>
            <Stack.Screen options={{ title: getTranslation('changelog.title') }} />
            <FlatList
                contentContainerClassName="min-h-full p-5 pt-2.5"
                keyboardShouldPersistTaps={'always'}
                data={filteredChangelogEntries}
                renderItem={({ item, index }) => renderItem(item)}
                keyExtractor={(item, index) => index.toString()}
            />
        </>
        
    );
}
