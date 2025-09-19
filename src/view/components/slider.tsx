import {compact} from 'lodash';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ViewProps} from 'react-native-svg/lib/typescript/fabric/utils';
import ButtonPicker from "@app/view/components/button-picker";

export interface SliderProps extends Omit<ViewProps, 'children'> {
    slides: React.ReactNode[];
    tabs: string[];
}

export const Slider: React.FC<SliderProps> = ({
    slides,
    tabs,
    style,
    ...props
}) => {
    const [activeIndex, setActiveIndex] = useState<string>();
    const values: string[] = compact(tabs);
    const firstValue = compact(tabs)[0];
    const formatTab = (x: string) => x ?? '';

    return (
        <View style={[styles.container, style]} {...props}>
            <View className="px-4 mb-5">
                <ButtonPicker
                    flex={true}
                    value={activeIndex ?? firstValue}
                    values={values}
                    formatter={formatTab}
                    onSelect={setActiveIndex}
                />
            </View>

            {/*{*/}
            {/*    compact(slides).map((slide: any, index: number) => (*/}
            {/*        <View key={index} style={{ display: (tabs[index] === (activeIndex ?? firstValue)) ? 'flex' : 'none' }}>*/}
            {/*            <Text>{index?.toString()}</Text>*/}
            {/*            {slide}*/}
            {/*        </View>*/}
            {/*    ))*/}
            {/*}*/}

            {/*<Text>active index: {activeIndex ?? firstValue}</Text>*/}

            {slides[tabs.indexOf(activeIndex ?? firstValue)]}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // backgroundColor: 'red',
        // height: 300,
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
