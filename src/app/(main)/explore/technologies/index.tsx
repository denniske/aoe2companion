import { Field } from '@app/components/field';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { SectionList } from '@app/components/section-list';
import { Text } from '@app/components/text';
import { scrollToSection, sectionItemLayout } from '@app/utils/list';
import { getBuildingName, getCivNameById, getTechName, techSections } from '@nex/data';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { SectionList as SectionListRef, View } from 'react-native';

import { TechCompBig } from '../../../../view/tech/tech-comp';
import { useTranslation } from '@app/helper/translate';
import cn from 'classnames';
import { containerClassName } from '@app/styles';
import { useShowTabBar } from '@app/hooks/use-show-tab-bar';
import { useBreakpoints } from '@app/hooks/use-breakpoints';

export default function TechList() {
    const getTranslation = useTranslation();
    const [text, setText] = useState('');
    const [scrollReady, setScrollReady] = useState(false);
    const sectionList = useRef<SectionListRef>(null);
    const { section } = useLocalSearchParams<{ section: string }>();

    const localList =
        text.length === 0
            ? techSections
            : techSections
                  .map((section) => ({
                      ...section,
                      data: section.data.filter((tech) => getTechName(tech).toLowerCase().includes(text.toLowerCase())),
                  }))
                  .filter((section) => section.data.length > 0);

    const showTabBar = useShowTabBar();

    const list = showTabBar
        ? localList.map((s) => ({ ...s, title: s.building ?? s.civ }))
        : [
              ...localList.filter((section) => !section.civ).map((s) => ({ ...s, title: s.building ?? s.civ })),
              {
                  title: getTranslation('unit.section.unique'),
                  data: localList.flatMap((section) => (section.civ ? section.data : [])),
              },
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

    const {isMedium} = useBreakpoints()

    return (
        <KeyboardAvoidingView>
            <View className="flex-1">
                <Stack.Screen options={{ title: getTranslation(isMedium ? 'explore.technologies' : 'tech.title') }} />

                <View className={cn('pt-4', containerClassName)}>
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
                    horizontalOnWeb
                    onLayout={() => setScrollReady(true)}
                    ref={sectionList}
                    getItemLayout={sectionItemLayout({ getItemHeight: () => 40, getSectionHeaderHeight: () => 40, listHeaderHeight: 16 })}
                    keyboardShouldPersistTaps="always"
                    contentContainerClassName="p-4"
                    sections={list}
                    stickySectionHeadersEnabled={false}
                    renderItem={({ item }) => <TechCompBig canShowCard key={item} tech={item} showCivBanner />}
                    renderSectionHeader={({ section: { building, civ, title } }) => (
                        <View className="h-10 justify-center">
                            <Text variant="header-sm" color="brand">
                                {building ? getBuildingName(building) : civ ? getCivNameById(civ!) : title}
                            </Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </KeyboardAvoidingView>
    );
}
