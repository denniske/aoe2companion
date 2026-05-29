import { HStack, Image, Text, VStack, ZStack, Link, Button, Spacer } from '@expo/ui/swift-ui';
import {
    background,
    containerBackground,
    cornerRadius,
    font,
    foregroundColor,
    foregroundStyle,
    frame,
    lineLimit,
    monospacedDigit,
    multilineTextAlignment,
    padding,
    resizable,
} from '@expo/ui/swift-ui/modifiers';
import { createLiveActivity, type LiveActivityEnvironment } from 'expo-widgets';
import { parseISO } from 'date-fns';
import { widgetStyle } from '@app/widgets/widget-style';


export type MatchActivityProps = {
    iosAppGroupFolder: string;
    playerId: number;
    match: Match; // IMatchRawGraphQl;
};

interface Match {
    matchId: number;
    started: string;
    finished?: string;
    leaderboard?: string;
    leaderboardName?: string;
    name?: string;
    map: string;
    mapName: string;
    mapImageUrl?: string;
    teams: Team[];
}

interface Team {
    teamId: number;
    players: Player[];
}

interface Player {
    profileId: number;
    name: string;
    rating?: number;
    civ?: string;
    civName?: string;
    civImageUrl?: string;
    won?: boolean;
}


const MatchActivity = (props: MatchActivityProps, environment: LiveActivityEnvironment) => {
    'widget';

    const style = widgetStyle[environment.colorScheme ?? 'light'];

    const slugifyFilename = (url?: string) => {
        if (!url) return '';

        url = url.replace('https://backend.cdn.aoe2companion.com/', '');

        const dotIndex = url.lastIndexOf('.');

        const name = dotIndex !== -1 ? url.slice(0, dotIndex) : url;
        const ext = dotIndex !== -1 ? url.slice(dotIndex) : '';

        const slugged = name.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');

        return slugged + ext;
    }

    const accentColor = environment.colorScheme === 'dark' ? '#FFFFFF' : '#007AFF';

    // const imagePath = slugifyFilename(props.match.mapImageUrl); //Paths.join(widgetGroupDir, slugifyFilename(props.match.mapImageUrl));
    const imagePathInAppGroup = (url?: string) => `file:///var/mobile/Containers/Shared/AppGroup/${props.iosAppGroupFolder}/` + slugifyFilename(url);


    const opponents = props.match.teams.map((t) => String(t.players.length));
    const opponentsCount = opponents.join('v');
    const startTime = parseISO(props.match.started);

    const currentPlayer = props.match.teams.find((t) => t.players[0].profileId === props.playerId)?.players[0] ?? props.match.teams[0].players[0];

    const opponent = props.match.teams.find((t) => t.players[0].profileId !== props.playerId)?.players[0] ?? props.match.teams[0].players[0];

    const PlayerRow = ({
        player,
        showRating = true,
        size = 16,
        bold = false,
    }: {
        player: Player;
        showRating?: boolean;
        size?: number;
        bold?: boolean;
    }) => {
        const imgSize = size >= 16 ? 20 : 15;

        return (
            <HStack spacing={4}>
                <Image uiImage={imagePathInAppGroup(player.civImageUrl)} modifiers={[resizable(), frame({ width: imgSize, height: imgSize })]} />

                <Text modifiers={[font({ size, weight: bold ? 'semibold' : 'regular' }), lineLimit(1)]}>{player.name}</Text>

                {showRating && player.rating != null && <Text modifiers={[font({ size })]}>{`(${player.rating})`}</Text>}
            </HStack>
        );
    };

    return {
        banner: (
            <HStack modifiers={[padding({ all: 15 }), containerBackground(style.backgroundColor, 'widget')]}>
                <Image uiImage={imagePathInAppGroup(props.match.mapImageUrl)} modifiers={[resizable(), frame({ width: 64, height: 64 })]} />

                <VStack modifiers={[padding({ leading: 12 }), frame({ maxWidth: Infinity, alignment: 'topLeading' })]} spacing={12}>
                    {/* Row 1: Map name + leaderboard/format */}
                    <HStack modifiers={[frame({ maxWidth: Infinity })]}>
                        <Text modifiers={[font({ size: 18, weight: 'semibold' }), lineLimit(1)]}>{props.match.mapName}</Text>
                        <Spacer />
                        <Text modifiers={[font({ size: 16 })]}>{`${props.match.leaderboardName ?? ''} ${opponentsCount}`}</Text>
                    </HStack>

                    {/* Row 2: Opponent row + result/timer */}
                    <HStack modifiers={[frame({ maxWidth: Infinity })]} spacing={4}>
                        <PlayerRow player={opponent} />

                        <Spacer />

                        {props.match.finished != null ? (
                            <Text modifiers={[font({ size: 16, weight: 'semibold' })]}>{currentPlayer.won === true ? 'Nice win!' : 'Game over'}</Text>
                        ) : (
                            <Text
                                modifiers={[
                                    font({ size: 16 }),
                                    monospacedDigit(),
                                    multilineTextAlignment('trailing'),
                                    lineLimit(1),
                                    frame({ width: 80 }),
                                ]}
                                date={startTime}
                                dateStyle={'timer'}
                            />
                        )}
                    </HStack>
                </VStack>
            </HStack>
        ),

        // banner: (
        //     <VStack modifiers={[padding({ all: 12 })]}>
        //         <Image uiImage={imagePath(props.match.mapImageUrl)} modifiers={[resizable(), frame({ width: 20, height: 20 })]} />
        //         <Text modifiers={[font({ weight: 'bold' }), foregroundStyle(accentColor)]}>{props.match.matchId}</Text>
        //         <Text>Estimated arrival5: {props.playerId} minutes</Text>
        //     </VStack>
        // ),

        compactLeading: <Image systemName="box.truck.fill" color={accentColor} />,
        compactTrailing: <Text>X min</Text>,
        minimal: <Image systemName="box.truck.fill" color={accentColor} />,
        expandedLeading: (
            <VStack modifiers={[padding({ all: 12 })]}>
                <Image systemName="box.truck.fill" color={accentColor} />
                <Text modifiers={[font({ size: 12 })]}>Delivering</Text>
            </VStack>
        ),
        expandedTrailing: (
            <VStack modifiers={[padding({ all: 12 })]}>
                <Text modifiers={[font({ weight: 'bold', size: 20 })]}>{props.match.map}</Text>
                <Text modifiers={[font({ size: 12 })]}>minutes</Text>
            </VStack>
        ),
        expandedBottom: (
            <VStack modifiers={[padding({ all: 12 })]}>
                <Text>Driver: John Smith</Text>
                <Text>Order #12345</Text>
            </VStack>
        ),
    };
};

export default createLiveActivity('MatchActivity', MatchActivity);
