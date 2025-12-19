import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { noop } from 'lodash';
import { useCallback, useRef } from 'react';
import { SectionListProps, View } from 'react-native';

export function SectionListWeb<ItemT>({
    contentContainerClassName,
    sections,
    renderItem,
    renderSectionHeader,
}: SectionListProps<ItemT> & { contentContainerClassName?: string }) {
    const params = useLocalSearchParams<{ section?: string }>();
    const refs = useRef<Array<HTMLDivElement>>([]);

    useFocusEffect(
        useCallback(() => {
            const section = params.section;
            if (section) {
                const index = sections.findIndex((s) => s.title === section);


    console.log('params', params, sections, index);
                if (index !== -1 && refs.current[index]) {

                    refs.current[index]?.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }, [params])
    );

    return (
        <View className={contentContainerClassName}>
            {sections.map((section, index) => (
                <View key={index}>
                    {renderSectionHeader && (
                        <div
                            ref={(ref) => {
                                if (ref) {
                                    refs.current[index] = ref;
                                }
                            }}
                        >
                            {renderSectionHeader({ section })}
                        </div>
                    )}

                    <View className="flex-row flex-wrap gap-x-2">
                        {section.data.map((item, itemIndex) => (
                            <View key={itemIndex}>
                                {renderItem?.({
                                    item,
                                    section,
                                    index: itemIndex,
                                    separators: { highlight: noop, unhighlight: noop, updateProps: noop },
                                })}
                            </View>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );
}
