import { NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native';
import { createStylesheet } from '../../theming-new';
import { ScrollView } from 'react-native';
import { useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { compact } from 'lodash';

export interface SliderProps {
    slides: React.ReactNode[];
    setActiveSlide?: (index: number) => void;
}

export const Slider: React.FC<SliderProps> = ({ slides: allSlides, setActiveSlide }) => {
    const styles = useStyles();
    const scrollView = useRef<ScrollView>(null);
    const [slideWidth, setSlideWidth] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const slides = compact(allSlides);

    const onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
        const newIndex = Math.min(Math.ceil(nativeEvent.contentOffset.x / slideWidth), slides.length - 1);
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
            setActiveSlide?.(newIndex);
        }
    };

    const scrollToIndex = (index: number) => {
        scrollView.current?.scrollTo({ x: slideWidth * index, animated: true });
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollView}
                horizontal
                onLayout={(e) => setSlideWidth(e.nativeEvent.layout.width)}
                style={styles.container}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={onScroll}
                scrollEventThrottle={32}
            >
                {slides.map((slide, index) => (
                    <View key={index} style={{ width: slideWidth }}>
                        {slide}
                    </View>
                ))}
            </ScrollView>
            <View style={styles.pagination}>
                {slides.map((_, index) => (
                    <TouchableOpacity hitSlop={15} key={index} style={styles.page} onPress={() => scrollToIndex(index)}>
                        {activeIndex === index && <View style={styles.activePage} />}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const useStyles = createStylesheet((theme, darkMode) =>
    StyleSheet.create({
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
    })
);
