import React from 'react';
import { Canvas, Circle, Rect, useCanvasRef } from '@shopify/react-native-skia';
import { TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { IAnalysis } from '@app/api/helper/api.types';
import { Text } from '@app/components/text';
import { Button } from 'react-native-paper';
import { usePaperTheme } from '@app/theming';
// import Animated, { useAnimatedProps, useDerivedValue, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useDerivedValue, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';


// import { Text as Text2 } from 'react-native';

// const AnimatedText = Animated.createAnimatedComponent(Text2);
// const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface Props {
    match: any;
    analysis: IAnalysis;
    analysisSvgUrl: string;
}

export default function MatchMap(props: Props) {
    const { match, analysis, analysisSvgUrl } = props;

    const ref = useCanvasRef();

    // useEffect(() => {
    //     setTimeout(() => {
    //         // you can pass an optional rectangle
    //         // to only save part of the image
    //         const image = ref.current?.makeImageSnapshot();
    //         if (image) {
    //             // you can use image in an <Image> component
    //             // Or save to file using encodeToBytes -> Uint8Array
    //             const bytes = image.encodeToBytes();
    //             console.log({ bytes });
    //         }
    //     }, 1000)
    // });

    const paperTheme = usePaperTheme();
    //  scale-y-[0.5] -rotate-45

    // const startAnim = () => {
    //     opacity.value = withDelay(1000, withTiming(1, { duration: 3000 }));
    // };
    //
    // const pauseAnim = () => {
    //     opacity.value = opacity.value;
    // };
    //
    // const revertAnim = () => {
    //     opacity.value = withDelay(1000, withTiming(0, { duration: 3000 }));
    // };
    //
    // const opacity = useSharedValue<number>(0);

    const startAnim = () => {
        time.value = withTiming(10, { duration: 10*1000 });
    };

    const pauseAnim = () => {
        time.value = time.value;
    };

    const revertAnim = () => {
        time.value = 0;
    };

    const time = useSharedValue<number>(0);

    const opacity = useDerivedValue(() => {
        return Math.max(0, (time.value - 1000) / 1000 * 1/3);
    });

    // const animatedProps = useAnimatedProps(() => {
    //     return {
    //         text: `Time: ${Math.floor(time.value)}`,
    //     };
    // });

    // const animatedProps = useAnimatedProps(() => {
    //     return {
    //         // text: `${Math.floor(time.value / 1000)}s`, // this won't work with Text, only TextInput's "value"
    //         value: `${Math.floor(time.value / 1000)}s`,
    //     };
    // });

    if (!analysis) {
        return <Text>Loading...</Text>;
    }

    // console.log('analysisSvgUrl', analysisSvgUrl);

    const size = 60 * 4 - 2;

    const dimension = analysis.map.dimension;

    // const units = analysis.players.flatMap((p) => {
    //     return p.objects?.filter(o => o.name === 'Villager').map(o => ({
    //         x: o.position.x,
    //         y: o.position.y,
    //         color: p.color,
    //     }));
    // }).filter(x => x);

    // Flare is when a player can see enemy so that these positions are seen
    // from the beginning of the game
    // (and for allies I think)

    // Sheep are sometimes gaia and when game starts become player sheep

    const townCenters = analysis.players
        .flatMap((p) => {
            return p.objects
                ?.filter((o) => o.name === 'Town Center' && o.objectId === 620)
                .map((o) => ({
                    x: o.position.x,
                    y: o.position.y,
                    color: p.color,
                }));
        })
        .filter((x) => x);

    // Gurjaras start with two Forage Bushes
    // Fruit Bushes

    // "Forage Bush",
    // "Fruit Bush",

    // "Gold Mine",
    // "Stone Mine",

    // "Goat",
    // "Ostrich",
    // "Elephant",

    // "Relic",

    const gaiaObjects = {
        bush: {
            names: [
                'Forage Bush', 'Fruit Bush',
            ],
            color: '#A5C56C',
        },
        gold: {
            names: [
                'Gold Mine',
            ],
            color: '#FFC700',
        },
        stone: {
            names: [
                'Stone Mine',
            ],
            color: '#919191',
        },
        animal: {
            names: [
                'Cow A',
                'Cow B',
                'Cow C',
                'Cow D',
                'Crocodile',
                'Deer',
                'Dire Wolf',
                'Elephant',
                // 'Falcon',
                'Goose',
                // 'Hawk',
                // 'Horse A',
                // 'Horse B',
                // 'Horse C',
                // 'Horse D',
                // 'Horse E',
                'Ibex',
                'Jaguar',
                'Javelina',
                'Komodo Dragon',
                'Lion',
                'Llama',
                // 'Macaw',
                'Ostrich',
                // 'Penguin',
                'Pig',
                'Rabid Wolf',
                'Rhinoceros',
                'Sheep',
                // 'Seagulls',
                'Snow Leopard',
                // 'Stork',
                'Tiger',
                'Turkey',
                // 'Vulture',
                'Water Buffalo',
                'Wild Bactrian Camel',
                'Wild Boar',
                'Wild Camel',
                'Wild Horse',
                'Wolf',
                'Zebra',
            ],
            objectIds: [
                // some names are undefined need to know object id
                // Hunnic Horse
                1869,
                // Gazelle
                1796,
                // Mouflon
                2340,
            ],
            color: '#A5C56C',
        },
        fish: {
            names: [
                'Box Turtles',
                'Dolphin',
                'Fish (Dorado)',
                'Fish (Perch)',
                'Fish (Salmon)',
                'Fish (Snapper)',
                'Fish (Tuna)',
                'Great Fish (Marlin)',
                'Shore Fish',
            ],
            // color: 'red',
            color: '#A5C56C',
        },
        relic: {
            names: [
                'Relic',
            ],
            color: '#FFF',
        },
        oysters: {
            names: [],
            objectIds: [
                // some names are undefined need to know object id
                // Oysters
                2170,
            ],
            color: '#FFF',
        },
    };

    const gaiaDraw = Object.keys(gaiaObjects).map((key) => {
        const info = gaiaObjects[key as keyof typeof gaiaObjects];
        return (
            analysis.gaia!
                .filter((o) => info.names.includes(o.name) || (info as any).objectIds?.includes(o.name))
                .map((o) => ({
                    x: o.position.x,
                    y: o.position.y,
                    color: info.color,
                }))
        );
    });

    const animals = analysis.gaia
        // ?.filter(o => o.name === 'Forage Bush')
        ?.filter((o) => o.name === 'Fruit Bush' || o.name === 'Ostrich')
        ?.map((o) => ({
            x: o.position.x,
            y: o.position.y,
        }));

    // console.log('units', units);
    // console.log('dimension', dimension);
    // console.log('size', size);


    return (
        <View>
            <Button onPress={() => startAnim()}
                    mode="contained"
                    uppercase={false}
                    dark={true}
                    buttonColor={paperTheme.colors.primary}
            >
                Start
            </Button>
            <Button onPress={() => pauseAnim()}
                    mode="contained"
                    uppercase={false}
                    dark={true}
                    buttonColor={paperTheme.colors.primary}
            >
                Pause
            </Button>
            <Button onPress={() => revertAnim()}
                    mode="contained"
                    uppercase={false}
                    dark={true}
                    buttonColor={paperTheme.colors.primary}
            >
                Revert
            </Button>
            {/*<AnimatedText animatedProps={animatedProps} />*/}
            {/*<AnimatedTextInput*/}
            {/*    editable={false}*/}
            {/*    animatedProps={animatedProps}*/}
            {/*    style={{*/}
            {/*        fontSize: 24,*/}
            {/*        fontWeight: 'bold',*/}
            {/*        color: 'black',*/}
            {/*    }}*/}
            {/*/>*/}

            <View className="flex-row justify-center border border-gray-300">
                <View className="relative w-60 h-60 border border-gray-700">
                    <View className="scale-y-[0.5] -rotate-45">
                        <Image
                            cachePolicy={'none'}
                            contentFit={'fill'}
                            style={{ width: size, height: size }}
                            // className="scale-y-[0.5] -rotate-45"
                            source={{ uri: analysisSvgUrl }}
                        ></Image>
                        <Canvas
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: size,
                                height: size,
                            }}
                            ref={ref}
                        >
                            {/*<Circle r={size/2} cx={size/2} cy={size/2} color="red" />*/}

                            {gaiaDraw.map(gaiaObj => gaiaObj.map((unit, index) => {
                                const x = (unit.x / dimension) * size; // * size / 100;
                                const y = (unit.y / dimension) * size; // * size / 100;

                                return (
                                    <Rect  key={index} width={(3 / dimension) * size} height={(3 / dimension) * size} x={x} y={y} color={unit.color} />
                                );

                            }))}

                            {townCenters.map((unit, index) => {
                                const x = (unit.x / dimension) * size; // * size / 100;
                                const y = (unit.y / dimension) * size; // * size / 100;

                                return (
                                    <Rect key={index} width={(3 / dimension) * size} height={(3 / dimension) * size} x={x} y={y} color={unit.color} />
                                );

                            })}

                            <Circle
                                opacity={opacity}
                                key={'circle'}
                                r={size/2}
                                cx={size/2}
                                cy={size/2}
                                color={'red'}
                            />
                        </Canvas>
                    </View>
                </View>
            </View>
        </View>
    );
}

// return (
//     <Circle
//         key={index}
//         r={size/2/20}
//         cx={x}
//         cy={y}
//         color={unit.color}
//     />
// )
