import { Button, Column, Image, Row, Text } from '@expo/ui/jetpack-compose';
import { background, cornerRadius, fillMaxSize, fillMaxWidth, padding, paddingAll, size } from '@expo/ui/jetpack-compose/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';
import { IExtendedBuildOrder } from '@/data/src/helper/builds';

// The Android twin of AABuilds.widget.tsx. Glance renders from @expo/ui/jetpack-compose rather than
// swift-ui, so the layout cannot be shared. Same widget name, so favorite-builds.ts feeds both
// platforms through the one AABuilds.updateSnapshot call.

type AABuildsProps = {
    builds: IExtendedBuildOrder[] | undefined;
};

type TargetButtonProps = { target: string; modifiers?: unknown[]; children?: React.ReactNode };

const AABuilds = (props: AABuildsProps, environment: WidgetEnvironment) => {
    'widget';
    // Everything the layout uses has to live inside this function: it is serialized and evaluated in
    // the widget runtime, where only the jetpack-compose globals exist.
    //
    // A Button whose target starts with `open:` opens that url in the app -- see the expo-widgets
    // patch in .yarn/patches. Glance has no Link equivalent, and `target` is not in Button's types.
    const TargetButton = Button as unknown as (props: TargetButtonProps) => React.JSX.Element;

    const widgetStyle = {
        dark: {
            backgroundColor: '#0e1017',
            cardBackgroundColor: '#181c29',
            foregroundColor: '#ffffff',
            foregroundNoteColor: '#8E8E93',
        },
        light: {
            backgroundColor: '#fffcf5',
            cardBackgroundColor: '#ffffff',
            foregroundColor: '#1C1C1E',
            foregroundNoteColor: '#8E8E93',
        },
    };

    const style = widgetStyle[environment.colorScheme === 'dark' ? 'dark' : 'light'];

    const builds = props.builds ?? [];

    const Build = (x: number) => {
        const build = builds[x];
        if (!build) return null;

        return (
            <TargetButton target={`open:aoe2companion://explore/build-orders/${build.id}`} modifiers={[fillMaxWidth(), padding(0, 0, 0, 6)]}>
                <Row
                    verticalAlignment="center"
                    modifiers={[fillMaxWidth(), background(style.cardBackgroundColor), cornerRadius(12), padding(10, 6, 10, 6)]}
                >
                    {build.imageUrl ? <Image source={{ uri: build.imageUrl }} modifiers={[size(36, 36)]} /> : null}
                    <Column modifiers={[padding(10, 0, 0, 0)]}>
                        <Row verticalAlignment="center">
                            {build.civilizationImageUrl ? (
                                <Image source={{ uri: build.civilizationImageUrl }} modifiers={[size(11, 11), padding(0, 0, 4, 0)]} />
                            ) : null}
                            <Text color={style.foregroundNoteColor} style={{ fontSize: 11 }} maxLines={1}>
                                {build.civilization}
                            </Text>
                        </Row>
                        <Text color={style.foregroundColor} style={{ fontSize: 15, fontWeight: 'bold' }} maxLines={1}>
                            {build.title}
                        </Text>
                    </Column>
                </Row>
            </TargetButton>
        );
    };

    return (
        <Column modifiers={[fillMaxSize(), background(style.backgroundColor), cornerRadius(16), paddingAll(12)]}>
            <TargetButton target="open:aoe2companion://explore/build-orders" modifiers={[fillMaxWidth(), padding(0, 0, 0, 8)]}>
                {/* Wrapped in a Row: a Button with only text inside renders as a grey Glance button. */}
                <Row modifiers={[fillMaxWidth()]}>
                    <Text color={style.foregroundColor} style={{ fontSize: 16, fontWeight: 'bold' }}>
                        Build Orders
                    </Text>
                </Row>
            </TargetButton>
            {builds.length === 0 ? (
                <Text color={style.foregroundNoteColor} style={{ fontSize: 13 }}>
                    Favorite a build order to see it here.
                </Text>
            ) : null}
            {Build(0)}
            {Build(1)}
            {Build(2)}
            {Build(3)}
            {Build(4)}
            {Build(5)}
        </Column>
    );
};

export default createWidget('AABuilds', AABuilds);
