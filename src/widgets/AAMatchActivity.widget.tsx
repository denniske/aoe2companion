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
import { components } from '@eva-design/eva/mapping';
import alignment = components.TopNavigation.meta_32.variantGroups_39.alignment;


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
    rating?: number | null;
    civ?: string;
    civName?: string;
    civImageUrl?: string;
    won?: boolean | null;
}

interface PlayerRow {
    player: Player;
    showRating?: boolean;
    size?: number;
    bold?: boolean;
}


const MatchActivity = (props: MatchActivityProps, environment: LiveActivityEnvironment) => {
    'widget';

    const widgetStyle = {"dark": {"backgroundColor": "#0e1017", "cardBackgroundColor": "#181c29", "cardBorderColor": "#1e2939", "foregroundColor": "#ffffff", "foregroundNoteColor": "#888888"}, "light": {"backgroundColor": "#fffcf5", "cardBackgroundColor": "#ffffff", "cardBorderColor": "#e5e7eb", "foregroundColor": "#000000", "foregroundNoteColor": "#888888"}};

    const style = widgetStyle[environment.colorScheme ?? 'light'];

    const slugifyFilename = (url?: string, size?: number) => {
        if (!url) return '';

        url = url.replace('https://backend.cdn.aoe2companion.com/', '');

        const dotIndex = url.lastIndexOf('.');

        const name = dotIndex !== -1 ? url.slice(0, dotIndex) : url;
        const ext = dotIndex !== -1 ? url.slice(dotIndex) : '';

        const slugged = name.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');

        const sizeStr = size ? `-${size}` : '';

        return slugged + sizeStr + ext;
    };

    const accentColor = environment.colorScheme === 'dark' ? '#FFFFFF' : '#007AFF';

    const imagePathInAppGroup = (url?: string, size?: number) => `file:///var/mobile/Containers/Shared/AppGroup/${props.iosAppGroupFolder}/` + slugifyFilename(url, size);

    const opponents = props.match.teams.map((t) => String(t.players.length));
    const opponentsCount = opponents.join('v');
    const startTime = new Date(props.match.started);

    const currentPlayer = props.match.teams.find((t) => t.players[0].profileId === props.playerId)?.players[0] ?? props.match.teams[0].players[0];

    const opponent = props.match.teams.find((t) => t.players[0].profileId !== props.playerId)?.players[0] ?? props.match.teams[0].players[0];

    const PlayerRow = (json: string) => {
        const playerRow = JSON.parse(json) as PlayerRow;
        const { size = 16, bold = false, showRating = true, player } = playerRow;
        const imgSize = size >= 16 ? 20 : 15;

        return (
            <HStack spacing={4}>
                <Image uiImage={imagePathInAppGroup(player.civImageUrl)} modifiers={[resizable(), frame({ width: imgSize, height: imgSize })]} />
                <Text modifiers={[font({ size, weight: bold ? 'semibold' : 'regular' }), lineLimit(1)]}>{player.name}</Text>
                {showRating && player.rating != null && <Text modifiers={[font({ size })]}>{`(${player.rating})`}</Text>}
            </HStack>
        );
    };

    const banner = (
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
                    {PlayerRow(JSON.stringify({ player: opponent }))}

                    {/*<Text>{JSON.stringify(opponent)}</Text>*/}
                    {/*<Text modifiers={[font({ size: 8 }), frame({ width: 80 })]}>{gg}</Text>*/}
                    {/*<Text modifiers={[font({ size: 8 }), frame({ width: 80 })]}>{imagePathInAppGroup(props.match.mapImageUrl)}</Text>*/}

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
    );

    return {
        banner,

        compactLeading: (
            <Image uiImage={imagePathInAppGroup(props.match.mapImageUrl, 75)} modifiers={[resizable(), frame({ width: 25, height: 25 })]} />
        ),

        compactTrailing: (
            <>
                {props.match.finished == null && (
                    <Text
                        modifiers={[font({ size: 16 }), monospacedDigit(), multilineTextAlignment('trailing'), frame({ width: 60 })]}
                        date={startTime}
                        dateStyle={'timer'}
                    />
                )}
                {props.match.finished != null && (
                    <Text modifiers={[font({ size: 14, weight: 'semibold' }), multilineTextAlignment('center')]}>
                        {currentPlayer.won == true ? 'Nice win!' : 'Game over'}
                    </Text>
                )}
            </>
        ),

        minimal: <Image uiImage={imagePathInAppGroup(props.match.mapImageUrl, 75)} modifiers={[resizable(), frame({ width: 25, height: 25 })]} />,

        expandedBottom: banner,

        // expandedLeading: (
        //     <Image uiImage={imagePathInAppGroup(props.match.mapImageUrl, 75)} modifiers={[resizable(), frame({ width: 25, height: 25 })]} />
        // ),
        //
        // expandedTrailing: (
        //     <>
        //         {props.match.finished == null && (
        //             <Text
        //                 modifiers={[font({ size: 16 }), monospacedDigit(), multilineTextAlignment('trailing'), frame({ width: 60 })]}
        //                 date={startTime}
        //                 dateStyle={'timer'}
        //             />
        //         )}
        //         {props.match.finished != null && (
        //             <Text
        //                 modifiers={[
        //                     font({ size: 14, weight: 'semibold' }),
        //                     multilineTextAlignment('trailing'),
        //                     padding({ trailing: 5 /* Otherwise cutoff */ }),
        //                 ]}
        //             >
        //                 {currentPlayer.won == true ? 'Nice win!' : 'Game over'}
        //             </Text>
        //         )}
        //     </>
        // ),
    };
};

export default createLiveActivity('MatchActivity', MatchActivity);
