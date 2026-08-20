import { Field } from '@app/components/field';
import { SectionList } from '@app/components/section-list';
import { Text } from '@app/components/text';
import { scrollToSection, sectionItemLayout } from '@app/utils/list';
import { allUnitSections, getCivNameById, getUnitName } from '@nex/data';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { SectionList as SectionListRef, View } from 'react-native';

import { UnitCompBig } from '../../../../view/unit/unit-comp';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { useTranslation } from '@app/helper/translate';
import cn from 'classnames';
import { containerClassName } from '@app/styles';
import { useShowTabBar } from '@app/hooks/use-show-tab-bar';

export default function UnitList() {
    const getTranslation = useTranslation();
    const [text, setText] = useState('');
    const [scrollReady, setScrollReady] = useState(false);
    const { section } = useLocalSearchParams<{ section: string }>();
    const sectionList = useRef<SectionListRef>(null);
    const showTabBar = useShowTabBar();

    const localList = allUnitSections
        .map((section) => ({
            ...section,
            data: section.data.filter((u) => getUnitName(u).toLowerCase().includes(text.toLowerCase())),
        }))
        .filter((section) => section.data.length > 0);

    // Same split as the technologies list: a section per civ where there is room to scroll
    // through them, and a single collapsed 'Unique' section otherwise.
    const list = showTabBar
        ? localList.map((s) => ({ ...s, title: s.title ?? s.civ }))
        : [
              ...localList.filter((section) => !section.civ).map((s) => ({ ...s, title: s.title ?? s.civ })),
              ...(localList.some((section) => section.civ)
                  ? [
                        {
                            title: 'unit.section.unique',
                            civ: undefined,
                            data: localList.flatMap((section) => (section.civ ? section.data : [])),
                        },
                    ]
                  : []),
          ];

    // Guarded by a ref rather than left out of the deps: 'list' is rebuilt on every
    // keystroke in the search field, and without the guard including it would re-scroll
    // the user back to the section while they type. Scrolls once per requested section.
    const scrolledToSection = useRef<string>(undefined);
    useEffect(() => {
        if (!section || !scrollReady || !sectionList.current) return;
        if (scrolledToSection.current === section) return;
        scrolledToSection.current = section;
        scrollToSection(sectionList.current, section, list);
    }, [section, scrollReady, list]);

    return (
        <KeyboardAvoidingView>
            <View className="flex-1">
                <Stack.Screen options={{ title: getTranslation('unit.title') }} />

                <View className={cn('pt-4', containerClassName)}>
                    <Field
                        type="search"
                        placeholder={getTranslation('unit.search.placeholder')}
                        onChangeText={(text) => setText(text)}
                        value={text}
                        onSubmitEditing={() => {
                            const topResult = list[0]?.data?.[0];
                            if (topResult) {
                                router.navigate(`/explore/units/${topResult}`);
                            }
                        }}
                    />
                </View>

                <SectionList
                    horizontalOnWeb
                    onLayout={() => setScrollReady(true)}
                    sections={list}
                    ref={sectionList}
                    getItemLayout={sectionItemLayout({ getItemHeight: () => 40, getSectionHeaderHeight: () => 40, listHeaderHeight: 16 })}
                    keyboardShouldPersistTaps="always"
                    contentContainerClassName="p-4"
                    stickySectionHeadersEnabled={false}
                    renderItem={({ item }) => {
                        return <UnitCompBig canShowCard key={item} unit={item} />;
                    }}
                    renderSectionHeader={({ section: { title, civ } }) => {
                        return (
                            <View className="h-10 justify-center">
                                <Text variant="header-sm" color="brand">
                                    {civ ? getCivNameById(civ) : getTranslation(title as any)}
                                </Text>
                            </View>
                        );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </KeyboardAvoidingView>
    );
}
