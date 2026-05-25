import { HStack, Image, Text, VStack, ZStack, Link, Button } from '@expo/ui/swift-ui';
import {
    background,
    containerBackground,
    cornerRadius,
    font,
    foregroundColor,
    frame,
    padding,
    resizable
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';
import { IExtendedBuildOrder } from '@/data/src/helper/builds';

type IWidgetStyle = {
    backgroundColor: string;
    foregroundColor: string;
    foregroundNoteColor: string;
    cardBackgroundColor: string;
    cardBorderColor: string;
}

type AABuildsProps = {
    style: Record<'light' | 'dark', IWidgetStyle>;
    builds: IExtendedBuildOrder[] | undefined
};

const AABuilds = (props: AABuildsProps, environment: WidgetEnvironment) => {
    'widget';
    const style = props.style[environment.colorScheme ?? 'light'];

    const { builds } = props;

    const Build = (x: number) =>{
        const build = builds?.[x];
        if (!build) return null;

        return (
            <Link destination={`aoe2companion://explore/build-orders/${build.id}`}>
                <ZStack
                    modifiers={[
                        frame({ maxWidth: Infinity, alignment: 'leading' }),
                        padding({ horizontal: 1, vertical: 1 }),
                        background(style.cardBorderColor),
                        cornerRadius(12),
                    ]}
                >
                    <HStack
                        modifiers={[
                            frame({ maxWidth: Infinity, alignment: 'leading' }),
                            padding({ horizontal: 10, vertical: 6 }),
                            background(style.cardBackgroundColor),
                            cornerRadius(11),
                        ]}
                        spacing={10}
                    >
                        <Image
                            uiImage={build.imageUrl}
                            modifiers={[resizable(), frame({ width: 36, height: 36 })]}
                        />
                        <VStack alignment="leading" spacing={2}>
                            <HStack spacing={4}>
                                <Image
                                    uiImage={build.civilizationImageUrl}
                                    modifiers={[resizable(), frame({ width: 11, height: 11 })]}
                                />
                                <Text modifiers={[font({ size: 11 }), foregroundColor('#8E8E93')]}>
                                    {build.civilization}
                                </Text>
                            </HStack>
                            <Text modifiers={[font({ weight: 'bold', size: 15 }), foregroundColor(environment.colorScheme === 'light' ? '#1C1C1E' : '#FFFFFF')]}>
                                {build.title}
                            </Text>
                        </VStack>
                    </HStack>
                </ZStack>
            </Link>
        );
    };

    return (
        <Link destination={`aoe2companion://explore/build-orders`}>
            <VStack
                spacing={8}
                modifiers={[
                    frame({ maxHeight: Infinity, alignment: 'top' }),
                    containerBackground(style.backgroundColor, 'widget'),
                ]}
            >
                <Text modifiers={[font({weight: 'bold', size: 16})]}>
                    {/*Build Orders*/}
                    Build Orders {props.builds?.length ?? 0}
                </Text>
                {Build(0)}
                {Build(1)}
                {Build(2)}
                {Build(3)}
                {Build(4)}
                {Build(5)}
            </VStack>
        </Link>
    );
};

export default createWidget('AABuilds', AABuilds);

// This might work but is very slow. Don't use it.
// <Image
//     uiImage={'https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FCastle.png?alt=media&token=16a7511e-6ce2-49e4-a198-3020b18c6871'}
//     modifiers={[resizable(), frame({ width: 11, height: 11 })]}
// />

// <Button target="YOLO" onPress={() => { Linking.openURL(`aoe2companion://explore/build-orders/${build.id}`) }}>

// Text modifiers foregroundStyle('#000000')
// <VStack modifiers={[containerBackground(environment.colorScheme === 'light' ? '#ffffff' : '#000000', 'widget')]}>

// background(environment.colorScheme === 'light' ? '#FF0000' : '#2C2C2E',
//     shapes.roundedRectangle({
//         cornerRadius: 12,
//         roundedCornerStyle: 'circular',
//         cornerSize: { width: 12, height: 12}
//     })
// ),
// border({ color: '#E0E0E0', width: 1 }),

// <Image
//     systemName="figure.equestrian.sports"
//     modifiers={[frame({ width: 36, height: 36 }), clipShape('circle')]}
// />
