import { SectionList, SectionListProps } from 'react-native';

export const sectionItemLayout =
    ({ sectionHeaderHeight, itemHeight, offset }: { sectionHeaderHeight: number; itemHeight: number; offset: number }) =>
    (data: { data: readonly any[] }[] | null, index: number) => {
        const sectionLengths = data?.map((section) => section.data.length + 2);
        let pointer = index + 1;
        let sectionIndex = 0;

        if (sectionLengths?.length) {
            while (pointer > 0) {
                pointer -= sectionLengths[sectionIndex];
                if (pointer > 0) {
                    sectionIndex++;
                }
            }
        }

        const itemIndex = index - sectionIndex * 2;

        return { length: itemHeight, offset: sectionHeaderHeight * sectionIndex + itemHeight * itemIndex + (index > 0 ? offset : 0), index };
    };

export const scrollToSection = (ref: SectionList, sectionTitle: string, list: SectionListProps<unknown>['sections']) => {
    const sectionIndex = list.findIndex((section) => section.title === sectionTitle);
    ref.scrollToLocation({ sectionIndex, itemIndex: 0, viewPosition: 0 });
};
