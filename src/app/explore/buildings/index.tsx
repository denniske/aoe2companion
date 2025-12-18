import { Field } from '@app/components/field';
import { SectionList } from '@app/components/section-list';
import { Text } from '@app/components/text';
import { scrollToSection, sectionItemLayout } from '@app/utils/list';
import { buildingSections, getBuildingName } from '@nex/data';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { SectionList as SectionListRef, View } from 'react-native';

import { BuildingCompBig } from '../../../view/building/building-comp';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { useTranslation } from '@app/helper/translate';
import cn from 'classnames';
import { containerClassName } from '@app/styles';

export default function BuildingList() {
    const getTranslation = useTranslation();
    const [text, setText] = useState('');
    const [list, setList] = useState(buildingSections);
    const [scrollReady, setScrollReady] = useState(false);
    const sectionList = useRef<SectionListRef>(null);
    const { section } = useLocalSearchParams<{ section: string }>();

    const refresh = () => {
        if (text.length == 0) {
            setList(buildingSections);
            return;
        }
        const newSections = buildingSections
            .map((section) => ({
                ...section,
                data: section.data.filter((building) => getBuildingName(building).toLowerCase().includes(text.toLowerCase())),
            }))
            .filter((section) => section.data.length > 0);
        setList(newSections);
    };

    useEffect(() => {
        refresh();
    }, [text]);

    useEffect(() => {
        if (section && scrollReady && sectionList.current) {
            scrollToSection(sectionList.current, section, list);
        }
    }, [section, scrollReady]);

    return (
        <KeyboardAvoidingView>
            <View className="flex-1">
                <Stack.Screen options={{ title: getTranslation('building.title') }} />

                <View className={cn('pt-4', containerClassName)}>
                    <Field
                        type="search"
                        placeholder={getTranslation('unit.search.placeholder')}
                        onChangeText={(text) => setText(text)}
                        value={text}
                        onSubmitEditing={() => {
                            const topResult = list[0]?.data?.[0];
                            if (topResult) {
                                router.navigate(`/explore/buildings/${topResult}`);
                            }
                        }}
                    />
                </View>

                <SectionList
                    horizontalOnWeb
                    onLayout={() => setScrollReady(true)}
                    ref={sectionList}
                    getItemLayout={sectionItemLayout({ getItemHeight: () => 40, getSectionHeaderHeight: () => 40, listHeaderHeight: 16 })}
                    keyboardShouldPersistTaps="always"
                    contentContainerClassName="p-4"
                    sections={list}
                    stickySectionHeadersEnabled={false}
                    renderItem={({ item }) => {
                        return <BuildingCompBig canShowCard key={item} building={item} />;
                    }}
                    renderSectionHeader={({ section: { title } }) => (
                        <View className="h-10 justify-center">
                            <Text variant="header-sm" color="brand">
                                {getTranslation(title as any)}
                            </Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </KeyboardAvoidingView>
    );
}
