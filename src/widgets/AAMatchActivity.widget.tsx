import { HStack, Image, Text, VStack, ZStack, Link, Button, Spacer, Grid } from '@expo/ui/swift-ui';
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


export type MatchActivityProps = {
    iosAppGroupFolder: string;
    playerId: number;
    match: Match;
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

interface TeamRow {
    team: Team;
    showRating?: boolean;
}

// Note: This file must be imported at the root layout (import '@app/widgets/AAMatchActivity.widget';)
//       Otherwise the widget will show a black box if there has not been a working debug install on the device before.
const MatchActivity = (props: MatchActivityProps, environment: LiveActivityEnvironment) => {
    'widget';

    const widgetStyle = {
        dark: {
            backgroundColor: '#0e1017',
            cardBackgroundColor: '#181c29',
            cardBorderColor: '#1e2939',
            foregroundColor: '#ffffff',
            foregroundNoteColor: '#888888',
        },
        light: {
            backgroundColor: '#fffcf5',
            cardBackgroundColor: '#ffffff',
            cardBorderColor: '#e5e7eb',
            foregroundColor: '#000000',
            foregroundNoteColor: '#888888',
        },
    };

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

    const imagePathInAppGroup = (url?: string, size?: number) =>
        `file:///var/mobile/Containers/Shared/AppGroup/${props.iosAppGroupFolder}/` + slugifyFilename(url, size);

    const opponents = props.match.teams.map((t) => String(t.players.length));
    const opponentsCount = opponents.join('v');
    const startTime = new Date(props.match.started);

    const currentPlayer = props.match.teams.find((t) => t.players[0].profileId === props.playerId)?.players[0] ?? props.match.teams[0].players[0];

    const opponent = props.match.teams.find((t) => t.players[0].profileId !== props.playerId)?.players[0] ?? props.match.teams[0].players[0];

    const PlayerRow = (json: string) => {
        // if (!json) return null;

        const playerRow = JSON.parse(json) as PlayerRow;
        if (!playerRow) return null;
        if (!playerRow.player) return null;

        const { size = 16, bold = false, showRating = true, player } = playerRow;
        const imgSize = size >= 16 ? 20 : 15;

        //, background('#FF0000')
        return (
            <HStack spacing={0} modifiers={[frame({ maxWidth: Infinity, alignment: 'leading' })]}>
                <Image
                    uiImage={imagePathInAppGroup(player.civImageUrl)}
                    modifiers={[resizable(), frame({ width: imgSize, height: imgSize }), padding({ trailing: 4 })]}
                />
                <Text modifiers={[font({ size, weight: bold ? 'semibold' : 'regular' }), lineLimit(1)]}>{player.name}</Text>
                {showRating && player.rating != null && (
                    <>
                        <Spacer />
                        <Text modifiers={[frame({ alignment: 'trailing' }), font({ size })]}>{`(${player.rating})`}</Text>
                    </>
                )}
            </HStack>
        );
    };

    const TeamRow = (json: string) => {
        // if (!json) return null;

        const teamRow = JSON.parse(json) as TeamRow;
        if (!teamRow) return null;

        const { team, showRating } = teamRow;
        if (!team) return null;
        const { players } = team;

        // Use Grid?
        return (
            <VStack modifiers={[frame({ maxWidth: Infinity, alignment: 'leading' })]} spacing={8}>
                {PlayerRow(JSON.stringify({ player: players[0], showRating }))}
                {PlayerRow(JSON.stringify({ player: players[1], showRating }))}
                {PlayerRow(JSON.stringify({ player: players[2], showRating }))}
                {players.length <= 4 && PlayerRow(JSON.stringify({ player: players[3], showRating }))}
                {players.length > 4 && (
                    <Text modifiers={[font({ size: 15 }), frame({ maxWidth: Infinity, alignment: 'leading' })]}>
                        And {players.length - 3} more...
                    </Text>
                )}
            </VStack>
        );
    };

    const deepLink = `aoe2companion://players/${props.playerId}/matches/${props.match.matchId}`;

    // activityBackgroundTint('#FF000033')

    const banner = (
        <Link destination={deepLink}>
            <VStack modifiers={[padding({ all: 15 }), containerBackground(style.backgroundColor, 'widget')]}>
                {opponentsCount === '1v1' ? (
                    <HStack modifiers={[padding({ all: 0 })]}>
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
                                <Spacer />
                                {props.match.finished != null ? (
                                    <Text modifiers={[font({ size: 16, weight: 'semibold' })]}>
                                        {currentPlayer.won === true ? 'Nice win!' : 'Game over'}
                                    </Text>
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
                ) : (
                    <VStack modifiers={[padding({ leading: 0 }), frame({ maxWidth: Infinity, alignment: 'topLeading' })]} spacing={12}>
                        {/* Row 1: Map name + leaderboard/format */}
                        <HStack modifiers={[frame({ maxWidth: Infinity })]} spacing={10}>
                            <Image
                                uiImage={imagePathInAppGroup(props.match.mapImageUrl)}
                                modifiers={[resizable(), frame({ width: 20, height: 20 })]}
                            />
                            <Text modifiers={[font({ size: 18, weight: 'semibold' }), lineLimit(1)]}>{props.match.mapName}</Text>
                            <Spacer />
                            <Text modifiers={[font({ size: 14 })]}>{`${props.match.leaderboardName ?? ''}`}</Text>
                            <Text modifiers={[font({ size: 14 })]}>{`${opponentsCount}`}</Text>
                            {/*<Text modifiers={[font({ size: 14 })]}>{`${props.match.leaderboardName ?? ''} ${opponentsCount}`}</Text>*/}
                            {props.match.finished != null ? (
                                <Text modifiers={[font({ size: 16, weight: 'semibold' })]}>
                                    {currentPlayer.won === true ? 'Nice win!' : 'Game over'}
                                </Text>
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

                        {/* Row 2: Opponent row + result/timer */}

                        {props.match.teams.length <= 4 && (
                            <>
                                <HStack modifiers={[frame({ maxWidth: Infinity })]} spacing={10}>
                                    {TeamRow(JSON.stringify({ team: props.match.teams[0] }))}
                                    {TeamRow(JSON.stringify({ team: props.match.teams[1] }))}
                                </HStack>
                                <HStack modifiers={[frame({ maxWidth: Infinity })]} spacing={10}>
                                    {TeamRow(JSON.stringify({ team: props.match.teams[2] }))}
                                    {TeamRow(JSON.stringify({ team: props.match.teams[3] }))}
                                </HStack>
                                {props.match.teams.length > 4 && (
                                    <HStack modifiers={[frame({ maxWidth: Infinity })]} spacing={10}>
                                        {TeamRow(JSON.stringify({ team: props.match.teams[4] }))}
                                        {TeamRow(JSON.stringify({ team: props.match.teams[5] }))}
                                    </HStack>
                                )}
                                {props.match.teams.length > 6 && (
                                    <HStack modifiers={[frame({ maxWidth: Infinity })]} spacing={10}>
                                        {TeamRow(JSON.stringify({ team: props.match.teams[6] }))}
                                        {TeamRow(JSON.stringify({ team: props.match.teams[7] }))}
                                    </HStack>
                                )}
                            </>
                        )}
                        {props.match.teams.length > 4 && (
                            <>
                                <HStack modifiers={[frame({ maxWidth: Infinity })]} spacing={10}>
                                    {TeamRow(JSON.stringify({ team: props.match.teams[0], showRating: false }))}
                                    {TeamRow(JSON.stringify({ team: props.match.teams[1], showRating: false }))}
                                    {TeamRow(JSON.stringify({ team: props.match.teams[2], showRating: false }))}
                                </HStack>
                                <HStack modifiers={[frame({ maxWidth: Infinity })]} spacing={10}>
                                    {TeamRow(JSON.stringify({ team: props.match.teams[3], showRating: false }))}
                                    {TeamRow(JSON.stringify({ team: props.match.teams[4], showRating: false }))}
                                    {TeamRow(JSON.stringify({ team: props.match.teams[5], showRating: false }))}
                                </HStack>
                                <HStack modifiers={[frame({ maxWidth: Infinity })]} spacing={10}>
                                    {TeamRow(JSON.stringify({ team: props.match.teams[6], showRating: false }))}
                                    {TeamRow(JSON.stringify({ team: props.match.teams[7], showRating: false }))}
                                </HStack>
                            </>
                        )}
                    </VStack>
                )}
            </VStack>
        </Link>
    );

    return {
        banner,

        compactLeading: (
            <Link destination={deepLink}>
                <Image uiImage={imagePathInAppGroup(props.match.mapImageUrl, 75)} modifiers={[resizable(), frame({ width: 25, height: 25 })]} />
            </Link>
        ),

        compactTrailing: (
            <Link destination={deepLink}>
                <>
                    {props.match.finished == null ? (
                        <Text
                            modifiers={[font({ size: 16 }), monospacedDigit(), multilineTextAlignment('trailing'), frame({ width: 60 })]}
                            date={startTime}
                            dateStyle={'timer'}
                        />
                    ) : (
                        <Text modifiers={[font({ size: 14, weight: 'semibold' }), multilineTextAlignment('center')]}>
                            {currentPlayer.won == true ? 'Nice win!' : 'Game over'}
                        </Text>
                    )}
                </>
            </Link>
        ),

        minimal: (
            <Link destination={deepLink}>
                <Image uiImage={imagePathInAppGroup(props.match.mapImageUrl, 75)} modifiers={[resizable(), frame({ width: 25, height: 25 })]} />
            </Link>
        ),

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
