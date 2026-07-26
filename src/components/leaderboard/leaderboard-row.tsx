import { isCountry } from '@app/components/select/country-select';
import { useTranslation } from '@app/helper/translate';
import { ImageLoader } from '@app/view/components/loader/image-loader';
import { TextLoader } from '@app/view/components/loader/text-loader';
import React from 'react';
import { Dimensions, Image, Pressable, PressableStateCallbackType, StyleSheet, Text, TextStyle, TouchableOpacity, View } from 'react-native';
import { ILeaderboardPlayer } from '../../api/helper/api.types';
import { createStylesheet } from '../../theming-new';

// Fixed height, not minHeight: the leaderboard's scroll maths promises the list
// that every row is exactly this tall. A row that rendered taller made the real
// layout disagree with that promise, so when a page landed and placeholder rows
// filled with content the list corrected itself — yanking the scroll position
// backwards and killing momentum mid-fling. Nothing in a row wraps (rank and name
// are both numberOfLines={1}), so pinning the height is safe.
export const ROW_HEIGHT = 45;

/**
 * One slot in a leaderboard list: a row that exists, holding a player once its
 * page has landed.
 *
 * The wrapper is not decoration. A leaderboard list is `total` rows long from the
 * first frame, and the obvious way to express "no data yet" — a hole in the array,
 * i.e. `undefined` — makes every unloaded row reference-equal to every other one.
 * FlashList v2 recycles a cell by handing the same ViewHolder a new index and a
 * new item, but it renders the children through
 *
 *     useMemo(() => renderItem({ item, index, ... }), [item, extraData, target, renderItem])
 *
 * with `index` deliberately left out of the deps (see ViewHolder.tsx in
 * @shopify/flash-list). So a cell recycled from row 40 to row 300 with `undefined`
 * on both sides sees nothing change and keeps the children it already had —
 * including the rank, which falls back to the list index while the row is a
 * skeleton. The result was a column of stale rank numbers whenever you scrolled
 * through a range that had not loaded, correcting itself only when the page
 * landed and the items became distinct objects again.
 *
 * One object per index means recycling always changes `item`. Keying the list by
 * `index` rather than by profile id is the other half: the key then survives the
 * skeleton -> data swap, so the cell updates props instead of being recycled.
 */
export interface LeaderboardListRow {
    index: number;
    player?: ILeaderboardPlayer;
}

/**
 * The two leaderboard rows.
 *
 * `LeaderboardRowLegacy` is the row exactly as it was before this change. It is
 * dead weight for the app itself and exists only so /more/leaderboard-row-benchmark
 * can measure the two against each other on a real device.
 *
 * `LeaderboardRow` is what the leaderboard screen renders. Same pixels, but it
 * calls no hooks at all: everything the row used to look up per instance —
 * translations, the theme, the country check, the window width — is now hoisted
 * to the screen and handed down. At 50 rows per commit that is the whole cost.
 */

// ---------------------------------------------------------------------------
// Legacy row (baseline for the benchmark page)
// ---------------------------------------------------------------------------

export interface LeaderboardRowLegacyProps {
    player?: ILeaderboardPlayer;
    i: number;
    leaderboardCountry: string | null;
    authProfileId?: number | null;
    rankWidth?: number;
    myRankWidth?: number;
    onSelect: (player: ILeaderboardPlayer) => void;
}

function LeaderboardRowLegacyInner(props: LeaderboardRowLegacyProps) {
    const getTranslation = useTranslation();
    const { player, i, rankWidth, myRankWidth, onSelect, leaderboardCountry, authProfileId } = props;

    const styles = useLegacyStyles();

    const isMe = player?.profileId != null && player?.profileId === authProfileId;
    const rowStyle = { height: ROW_HEIGHT };
    const weightStyle = { fontWeight: isMe ? 'bold' : 'normal' } as TextStyle;
    const rankWidthStyle = { width: Math.max(myRankWidth || 43, rankWidth || 43) } as TextStyle;

    return (
        <TouchableOpacity style={[styles.row, rowStyle]} disabled={player == null} onPress={() => onSelect(player!)}>
            <View style={styles.innerRowWithBorder}>
                <TextLoader numberOfLines={1} style={[styles.cellRank, weightStyle, rankWidthStyle]}>
                    #{isCountry(leaderboardCountry) ? player?.rankCountry : player?.rank || i + 1}
                </TextLoader>

                <TextLoader style={isMe ? styles.cellRatingMe : styles.cellRating}>{player?.rating}</TextLoader>
                <View style={styles.cellName}>
                    <ImageLoader source={{ uri: player?.avatarSmallUrl }} ready={player} className="w-5 h-5 mr-2 rounded-full" />
                    <TextLoader style={isMe ? styles.nameMe : styles.name} numberOfLines={1}>
                        {player?.name}
                    </TextLoader>
                </View>

                {Dimensions.get('window').width >= 360 && (
                    <TextLoader ready={player?.games} style={styles.cellGames}>
                        {getTranslation('leaderboard.games', { games: player?.games })}
                    </TextLoader>
                )}
            </View>
        </TouchableOpacity>
    );
}

export const LeaderboardRowLegacy = React.memo(LeaderboardRowLegacyInner);

// ---------------------------------------------------------------------------
// Current row
// ---------------------------------------------------------------------------

export interface LeaderboardRowProps {
    /** Undefined while the page this row belongs to has not landed yet. */
    player?: ILeaderboardPlayer;
    i: number;
    /**
     * `isCountry(leaderboardCountry)` from the screen. isCountry() lowercases and
     * then scans a ~250-entry array, which has no business running once per row.
     */
    showCountryRank: boolean;
    /** `Dimensions.get('window').width >= 360` from the screen. */
    showGames: boolean;
    /** The raw `leaderboard.games` string, still holding its `{games}` placeholder. */
    gamesLabel: string;
    authProfileId?: number | null;
    /** Already resolved to `Math.max(myRankWidth || 43, rankWidth || 43)`. */
    rankWidth: number;
    /**
     * Handed down rather than looked up here. createStylesheet() builds both theme
     * variants once at module load, so the object identity is stable per theme and
     * this stays memo-safe — but calling the hook per row would mean one
     * useColorScheme subscription per row, plus another for every text inside it.
     */
    styles: LeaderboardRowStyles;
    onSelect: (player: ILeaderboardPlayer) => void;
}

// Constant across themes, so they can live outside the themed sheet and be
// referenced without allocating a style array per render.
const staticStyles = StyleSheet.create({
    row: {
        flex: 1,
        height: ROW_HEIGHT,
    },
    rowPressed: {
        flex: 1,
        height: ROW_HEIGHT,
        opacity: 0.2,
    },
});

// Module-level, so Pressable gets the same function identity on every render.
// Matches TouchableOpacity's press feedback.
const pressableStyle = ({ pressed }: PressableStateCallbackType) => (pressed ? staticStyles.rowPressed : staticStyles.row);

function LeaderboardRowInner(props: LeaderboardRowProps) {
    const { player, i, showCountryRank, showGames, gamesLabel, authProfileId, rankWidth, styles, onSelect } = props;

    const isMe = player?.profileId != null && player.profileId === authProfileId;
    const rankWidthStyle = { width: rankWidth };

    return (
        <Pressable style={player == null ? staticStyles.row : pressableStyle} disabled={player == null} onPress={() => onSelect(player!)}>
            <View style={styles.innerRowWithBorder}>
                {/*
                 * No skeleton here, deliberately: the old row passed `#` plus the
                 * value to TextLoader, i.e. children were an array and never null,
                 * so the rank cell always rendered — falling back to the list index
                 * while the page was still in flight. Keep that; a column of #1..#50
                 * during loading is the only thing telling you where you are.
                 */}
                <Text numberOfLines={1} style={[isMe ? styles.cellRankMe : styles.cellRank, rankWidthStyle]}>
                    #{showCountryRank ? player?.rankCountry : player?.rank || i + 1}
                </Text>

                {player == null ? (
                    <Text style={styles.cellRatingSkeleton} />
                ) : (
                    <Text style={isMe ? styles.cellRatingMe : styles.cellRating}>{player.rating}</Text>
                )}

                <View style={styles.cellName}>
                    <View style={player == null ? styles.avatarSkeleton : styles.avatar}>
                        {!!player?.avatarSmallUrl && <Image source={{ uri: player.avatarSmallUrl }} style={styles.avatarImage} />}
                    </View>
                    {player == null ? (
                        <Text style={styles.nameSkeleton} />
                    ) : (
                        <Text style={isMe ? styles.nameMe : styles.name} numberOfLines={1}>
                            {player.name}
                        </Text>
                    )}
                </View>

                {!!showGames &&
                    (player?.games ? (
                        // The placeholder is always literally `{games}` in every
                        // translation, so a plain replace saves building a RegExp
                        // per row the way getTranslation() does.
                        <Text style={styles.cellGames}>{gamesLabel.replace('{games}', String(player.games))}</Text>
                    ) : (
                        <Text style={styles.cellGamesSkeleton} />
                    ))}
            </View>
        </Pressable>
    );
}

export const LeaderboardRow = React.memo(LeaderboardRowInner);

/**
 * Reads the raw `leaderboard.games` string (placeholder intact) so the row can
 * fill it in without a translation lookup of its own.
 */
export function useLeaderboardGamesLabel() {
    const getTranslation = useTranslation();
    return getTranslation('leaderboard.games') ?? '';
}

const padding = 8;

// Only the styles a row actually uses. Text colours and sizes are baked in here
// because the row renders plain react-native <Text>, not MyText — MyText applies
// them by calling useAppTheme(), i.e. one more useColorScheme subscription per
// cell, four cells per row, fifty rows per commit.
export const useLeaderboardRowStyles = createStylesheet((theme) => {
    const skeleton = {
        backgroundColor: theme.skeletonColor,
        borderRadius: 5,
        color: 'transparent',
    } as const;
    // Matches the height react-native gives a single line of text at these sizes,
    // so the bar sits where the text will. An empty <Text> keeps the element type
    // stable across the skeleton -> data swap (React updates props instead of
    // tearing the native view down) and costs no text measuring in the meantime.
    const skeletonLine = { ...skeleton, height: 17 };
    const skeletonLineSmall = { ...skeleton, height: 15 };

    const cellRank = {
        margin: padding,
        textAlign: 'left',
        fontSize: 14,
        color: theme.textColor,
    } as const;
    const cellRating = {
        margin: padding,
        width: 38,
        fontSize: 14,
        color: theme.textColor,
    } as const;
    const name = {
        flex: 1,
        fontSize: 14,
        color: theme.textColor,
    } as const;
    const cellGames = {
        margin: padding,
        width: 90,
        textAlign: 'right',
        fontSize: 12,
        color: theme.textNoteColor,
    } as const;
    const avatar = {
        width: 20,
        height: 20,
        marginRight: 8,
        borderRadius: 10,
    } as const;

    return StyleSheet.create({
        innerRowWithBorder: {
            flex: 1,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.lightBorderColor,
        },
        cellRank,
        cellRankMe: { ...cellRank, fontWeight: 'bold' },
        cellRating,
        cellRatingMe: { ...cellRating, fontWeight: 'bold' },
        cellRatingSkeleton: { ...cellRating, ...skeletonLine },
        cellName: {
            margin: padding,
            flex: 4,
            flexDirection: 'row',
            alignItems: 'center',
        },
        name,
        nameMe: { ...name, fontWeight: 'bold' },
        nameSkeleton: { ...name, ...skeletonLine },
        cellGames,
        cellGamesSkeleton: { ...cellGames, ...skeletonLineSmall },
        avatar,
        avatarSkeleton: { ...avatar, backgroundColor: theme.skeletonColor },
        avatarImage: { width: 20, height: 20, borderRadius: 10 },
    } as const);
});

export type LeaderboardRowStyles = ReturnType<typeof useLeaderboardRowStyles>;

const useLegacyStyles = createStylesheet((theme) =>
    StyleSheet.create({
        name: {
            flex: 1,
        },
        nameMe: {
            flex: 1,
            fontWeight: 'bold',
        },
        cellRank: {
            margin: padding,
            textAlign: 'left',
        },
        cellRating: {
            margin: padding,
            width: 38,
        },
        cellRatingMe: {
            margin: padding,
            width: 38,
            fontWeight: 'bold',
        },
        cellName: {
            margin: padding,
            flex: 4,
            flexDirection: 'row',
            alignItems: 'center',
        },
        cellGames: {
            margin: padding,
            width: 90,
            textAlign: 'right',
            fontSize: 12,
            color: theme.textNoteColor,
        },
        row: {
            flex: 1,
        },
        innerRowWithBorder: {
            flex: 1,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.lightBorderColor,
        },
    } as const)
);
