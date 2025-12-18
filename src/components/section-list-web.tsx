import { noop } from 'lodash';
import { SectionListProps, View } from 'react-native';

export function SectionListWeb<ItemT>({
    contentContainerClassName,
    sections,
    renderItem,
    renderSectionHeader,
}: SectionListProps<ItemT> & { contentContainerClassName?: string }) {
    return (
        <View className={contentContainerClassName}>
            {sections.map((section, index) => (
                <View key={index}>
                    {renderSectionHeader && renderSectionHeader({ section })}

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
