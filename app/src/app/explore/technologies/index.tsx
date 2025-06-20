import { Field } from '@app/components/field';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { SectionList } from '@app/components/section-list';
import { Text } from '@app/components/text';
import { scrollToSection, sectionItemLayout } from '@app/utils/list';
import { getBuildingName, getTechName, getCivNameById, techSections } from '@nex/data';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { View, SectionList as SectionListRef } from 'react-native';

import { TechCompBig } from '../../../view/tech/tech-comp';
import { useTranslation } from '@app/helper/translate';

export default function TechList() {
    const getTranslation = useTranslation();
    const [text, setText] = useState('');
    const [list, setList] = useState(techSections);
    const [scrollReady, setScrollReady] = useState(false);
    const sectionList = useRef<SectionListRef>(null);
    const { section } = useLocalSearchParams<{ section: string }>();

    const refresh = () => {
        if (text.length === 0) {
            setList(techSections);
            return;
        }
        const newSections = techSections
            .map((section) => ({
                ...section,
                data: section.data.filter((tech) => getTechName(tech).toLowerCase().includes(text.toLowerCase())),
            }))
            .filter((section) => section.data.length > 0);
        setList(newSections);
    };

    useEffect(() => {
        refresh();
    }, [text]);

    useEffect(() => {
        if (section && scrollReady && sectionList.current) {
            scrollToSection(
                sectionList.current,
                section,
                list.map((s) => ({ ...s, title: s.building ?? s.civ }))
            );
        }
    }, [section, scrollReady]);

    return (
        <KeyboardAvoidingView>
            <View className="flex-1">
                <Stack.Screen options={{ title: getTranslation('tech.title') }} />

                <View className="pt-4 px-4">
                    <Field
                        type="search"
                        placeholder={getTranslation('tech.search.placeholder')}
                        onChangeText={(text) => setText(text)}
                        value={text}
                        onSubmitEditing={() => {
                            const topResult = list[0]?.data?.[0];
                            if (topResult) {
                                router.navigate(`/explore/technologies/${topResult}`);
                            }
                        }}
                    />
                </View>

                <SectionList
                    onLayout={() => setScrollReady(true)}
                    ref={sectionList}
                    getItemLayout={sectionItemLayout({ getItemHeight: () => 40, getSectionHeaderHeight: () => 40, listHeaderHeight: 16 })}
                    keyboardShouldPersistTaps="always"
                    contentContainerStyle="p-4"
                    sections={list}
                    stickySectionHeadersEnabled={false}
                    renderItem={({ item }) => <TechCompBig key={item} tech={item} showCivBanner />}
                    renderSectionHeader={({ section: { building, civ } }) => (
                        <View className="h-10 justify-center">
                            <Text variant="header-sm" color="brand">
                                {building ? getBuildingName(building) : getCivNameById(civ!)}
                            </Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </KeyboardAvoidingView>
    );
}
