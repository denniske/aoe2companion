import { HStack, Text, VStack, Image, List} from '@expo/ui/swift-ui';
import {containerBackground, font, foregroundStyle, background, cornerRadius, padding, clipShape, foregroundColor, frame} from '@expo/ui/swift-ui/modifiers';
import {createWidget, type WidgetEnvironment} from 'expo-widgets';
import { IBuildOrder } from '@/data/src/helper/builds';

type IWidgetStyle = {
    backgroundColor: string;
    foregroundColor: string;
    foregroundNoteColor: string;
}

type AABuildsProps = {
    count: number;
    style: Record<'light' | 'dark', IWidgetStyle>;
    builds: IBuildOrder[] | undefined
};


// const AABuildsComp = (prop: {props: AABuildsProps, environment: WidgetEnvironment}) => {
//     // 'widget';
//     const {props, environment} = prop;
//     const style = props.style[environment.colorScheme ?? 'light'];
//     return (
//         <HStack
//             modifiers={[
//                 containerBackground(style.backgroundColor, 'widget'),
//                 background(environment.colorScheme === 'light' ? '#FFFFFF' : '#2C2C2E'),
//                 cornerRadius(12),
//                 padding({ horizontal: 12, vertical: 10 })
//             ]}
//             spacing={10}
//         >
//             <Image
//                 systemName="figure.equestrian.sports"
//                 modifiers={[frame({ width: 36, height: 36 }), clipShape('circle')]}
//             />
//             <VStack alignment="leading" spacing={2}>
//                 <HStack spacing={4}>
//                     <Text modifiers={[font({ size: 11 }), foregroundColor('#8E8E93')]}>
//                         🏆 kkk
//                     </Text>
//                 </HStack>
//                 <Text modifiers={[font({ weight: 'bold', size: 15 }), foregroundColor(environment.colorScheme === 'light' ? '#1C1C1E' : '#FFFFFF')]}>
//                     Fast Scouts
//                 </Text>
//             </VStack>
//         </HStack>
//     );
// };

const AABuilds = (props: AABuildsProps, environment: WidgetEnvironment) => {
    'widget';
    const style = props.style[environment.colorScheme ?? 'light'];

    const { builds } = props;

    // const buildRows = props.builds?.map((build) => (
    //     <HStack
    //         modifiers={[
    //             background(environment.colorScheme === 'light' ? '#FFFFFF' : '#2C2C2E'),
    //             cornerRadius(12),
    //             padding({ horizontal: 12, vertical: 10 })
    //         ]}
    //         spacing={10}
    //     >
    //         <Image
    //             systemName="figure.equestrian.sports"
    //             modifiers={[frame({ width: 36, height: 36 }), clipShape('circle')]}
    //         />
    //         <VStack alignment="leading" spacing={2}>
    //             <HStack spacing={4}>
    //                 <Text modifiers={[font({ size: 11 }), foregroundColor('#8E8E93')]}>
    //                     🏆 {build.civilization}
    //                 </Text>
    //             </HStack>
    //             <Text modifiers={[font({ weight: 'bold', size: 15 }), foregroundColor(environment.colorScheme === 'light' ? '#1C1C1E' : '#FFFFFF')]}>
    //                 Fast Scouts
    //             </Text>
    //         </VStack>
    //     </HStack>
    // ));

    const HH = (x : number) =>{
        return (
            <Text modifiers={[font({ size: 11 }), foregroundColor('#8E8E93')]}>
                🏆 civ
            </Text>
        );
    };

    // prop: {props: AABuildsProps, environment: WidgetEnvironment}
    const AABuildsComp = (x: number) =>{
        // const {props, environment} = prop;
        // const style = props.style[environment.colorScheme ?? 'light'];
        return (
            // <Text modifiers={[font({ size: 11 }), foregroundColor('#8E8E93')]}>
            //     🏆 civ
            // </Text>
            <HStack
                modifiers={[
                    containerBackground(style.backgroundColor, 'widget'),
                    background(environment.colorScheme === 'light' ? '#FFFFFF' : '#2C2C2E'),
                    cornerRadius(12),
                    padding({ horizontal: 12, vertical: 10 })
                ]}
                spacing={10}
            >
                <Image
                    systemName="figure.equestrian.sports"
                    modifiers={[frame({ width: 36, height: 36 }), clipShape('circle')]}
                />
                <VStack alignment="leading" spacing={2}>
                    <HStack spacing={4}>
                        <Text modifiers={[font({ size: 11 }), foregroundColor('#8E8E93')]}>
                            🏆 {builds?.[x]?.civilization}
                        </Text>
                    </HStack>
                    <Text modifiers={[font({ weight: 'bold', size: 15 }), foregroundColor(environment.colorScheme === 'light' ? '#1C1C1E' : '#FFFFFF')]}>
                        Fast Scouts
                    </Text>
                </VStack>
            </HStack>
        );
    };

    return (
        <VStack modifiers={[containerBackground(style.backgroundColor, 'widget')]}>
            <Text modifiers={[font({weight: 'bold', size: 16})]}>
                Build Orders {props.builds?.length ?? 0}
            </Text>

            {/*<AABuildsComp props={props} environment={environment} />*/}

            {/*{AABuildsComp({props, environment})}*/}
            {AABuildsComp(0)}
            {AABuildsComp(1)}
            {/*{HH(1)}*/}

            {/*{(props.builds?.length ?? 0) >= 1 &&*/}
            {/*    <HStack*/}
            {/*        modifiers={[*/}
            {/*            background(environment.colorScheme === 'light' ? '#FFFFFF' : '#2C2C2E'),*/}
            {/*            cornerRadius(12),*/}
            {/*            padding({ horizontal: 12, vertical: 10 })*/}
            {/*        ]}*/}
            {/*        spacing={10}*/}
            {/*    >*/}
            {/*        <Image*/}
            {/*            systemName="figure.equestrian.sports"*/}
            {/*            modifiers={[frame({ width: 36, height: 36 }), clipShape('circle')]}*/}
            {/*        />*/}
            {/*        <VStack alignment="leading" spacing={2}>*/}
            {/*            <HStack spacing={4}>*/}
            {/*                {HH(1)}*/}
            {/*            </HStack>*/}
            {/*            <Text modifiers={[font({ weight: 'bold', size: 15 }), foregroundColor(environment.colorScheme === 'light' ? '#1C1C1E' : '#FFFFFF')]}>*/}
            {/*                Fast Scouts*/}
            {/*            </Text>*/}
            {/*        </VStack>*/}
            {/*    </HStack>*/}
            {/*}*/}

            {/*{(props.builds?.length ?? 0) >= 2 &&*/}
            {/*    <HStack*/}
            {/*        modifiers={[*/}
            {/*            background(environment.colorScheme === 'light' ? '#FFFFFF' : '#2C2C2E'),*/}
            {/*            cornerRadius(12),*/}
            {/*            padding({ horizontal: 12, vertical: 10 })*/}
            {/*        ]}*/}
            {/*        spacing={10}*/}
            {/*    >*/}
            {/*        <Image*/}
            {/*            systemName="figure.equestrian.sports"*/}
            {/*            modifiers={[frame({ width: 36, height: 36 }), clipShape('circle')]}*/}
            {/*        />*/}
            {/*        <VStack alignment="leading" spacing={2}>*/}
            {/*            <HStack spacing={4}>*/}
            {/*                <Text modifiers={[font({ size: 11 }), foregroundColor('#8E8E93')]}>*/}
            {/*                    🏆 civ*/}
            {/*                </Text>*/}
            {/*            </HStack>*/}
            {/*            <Text modifiers={[font({ weight: 'bold', size: 15 }), foregroundColor(environment.colorScheme === 'light' ? '#1C1C1E' : '#FFFFFF')]}>*/}
            {/*                Fast Scouts*/}
            {/*            </Text>*/}
            {/*        </VStack>*/}
            {/*    </HStack>*/}
            {/*}*/}

            {/*<Text>Family: {environment.widgetFamily}</Text>*/}
            {/*<Text modifiers={[font({weight: 'bold', size: 16})]}>*/}
            {/*    Count: {props.count}*/}
            {/*</Text>*/}
        </VStack>
    );
};

export default createWidget('AABuilds', AABuilds);

// Text modifiers foregroundStyle('#000000')
// <VStack modifiers={[containerBackground(environment.colorScheme === 'light' ? '#ffffff' : '#000000', 'widget')]}>
