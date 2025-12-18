import { Field } from '@app/components/field';
import { SectionList } from '@app/components/section-list';
import { Text } from '@app/components/text';
import { scrollToSection, sectionItemLayout } from '@app/utils/list';
import { allUnitSections, getUnitName } from '@nex/data';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { SectionList as SectionListRef, View } from 'react-native';

import { UnitCompBig } from '../../../view/unit/unit-comp';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { useTranslation } from '@app/helper/translate';
import cn from 'classnames';
import { containerClassName } from '@app/styles';

export default function UnitList() {
    const getTranslation = useTranslation();
    const [text, setText] = useState('');
    const [scrollReady, setScrollReady] = useState(false);
    const [list, setList] = useState(allUnitSections);
    const { section } = useLocalSearchParams<{ section: string }>();
    const sectionList = useRef<SectionListRef>(null);

    const refresh = () => {
        const newSections = allUnitSections
            .map((section) => ({
                ...section,
                data: section.data.filter((u) => {
                    // if (unitLines[u]) {
                    //     return unitLines[u].units.some(u => getUnitName(u).toLowerCase().includes(text.toLowerCase()));
                    // }
                    return getUnitName(u).toLowerCase().includes(text.toLowerCase());
                }),
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
                    renderSectionHeader={({ section: { title } }) => {
                        return (
                            <View className="h-10 justify-center">
                                <Text variant="header-sm" color="brand">
                                    {getTranslation(title as any)}
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
