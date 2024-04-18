import { compact } from 'lodash';
import { useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';

export interface SliderProps extends Omit<ViewProps, 'children'> {
    slides: React.ReactNode[];
    setActiveSlide?: (index: number) => void;
    pagination?: (scrollTo: (index: number) => void, current: number) => React.ReactElement;
    equalizeHeights?: boolean;
    scrollEnabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
    slides: allSlides,
    setActiveSlide,
    pagination,
    scrollEnabled = true,
    equalizeHeights = true,
    style,
    ...props
}) => {
    const scrollView = useRef<FlatList>(null);
    const [slideWidth, setSlideWidth] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const slides = compact(allSlides);

    const onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
        const newIndex = Math.min(Math.ceil((nativeEvent.contentOffset.x - slideWidth / 2) / slideWidth), slides.length - 1);
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
            setActiveSlide?.(newIndex);
        }
    };

    const scrollToIndex = (index: number) => {
        (scrollView.current?.getScrollResponder() as ScrollView | undefined)?.scrollTo({ x: slideWidth * index, animated: true });
    };

    return (
        <View style={[styles.container, style]} {...props}>
            {slides.length > 1 &&
                (pagination ? (
                    pagination(scrollToIndex, activeIndex)
                ) : (
                    <View style={styles.pagination}>
                        {slides.map((_, index) => (
                            <TouchableOpacity hitSlop={15} key={index} style={styles.page} onPress={() => scrollToIndex(index)}>
                                {activeIndex === index && <View style={styles.activePage} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            <FlatList
                scrollEnabled={scrollEnabled && slides.length > 1}
                ref={scrollView}
                horizontal
                onLayout={(e) => setSlideWidth(e.nativeEvent.layout.width)}
                style={styles.container}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={onScroll}
                scrollEventThrottle={32}
                data={slides}
                renderItem={({ item: slide, index }) => (
                    <View key={index} style={{ width: slideWidth }}>
                        <View className="flex-1" style={activeIndex === index || equalizeHeights ? undefined : StyleSheet.absoluteFillObject}>
                            {slide}
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pagination: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        gap: 12,
        bottom: 35,
        zIndex: 10,
    },
    page: {
        borderRadius: 15,
        width: 15,
        height: 15,
        borderColor: '#b8862d',
        borderWidth: 1,
        padding: 1,
    },
    activePage: {
        backgroundColor: '#b8862d',
        opacity: 1,
        width: '100%',
        flex: 1,
        borderRadius: 15,
    },
});
