import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Image } from '@/src/components/uniwind/image';
import type { ImageSourceProp } from '@app/components/uniwind/image';
import { Text } from '@app/components/text';
import { cdnImageUrl } from '@app/helper/maps';
import { getAgeIcon } from '@app/helper/units';
import { getTimestampMs, ILegendInfo } from '@app/view/components/match-map/match-map';
import { useTranslation } from '@app/helper/translate';
import { unitIconImageDict } from '@/assets/units';
import { techIconImageDict } from '@/assets/techs';
import { buildingIconImageDict } from '@/assets/buildings';
import { civList, techSections } from '@nex/data';
import ButtonPicker from '@app/view/components/button-picker';

interface Props {
    teams: ILegendInfo;
}

type Player = ILegendInfo[number]['players'][number];
type Kind = 'unit' | 'tech' | 'building';

interface Step {
    time: number;
    name: string;
    kind: Kind;
    count: number;
}

/** One player's queue within one minute: units and buildings summed per name, techs in order. */
interface Bucket {
    build: Step[];
    techs: Step[];
}

const MINUTE = 60_000;
// Rows shown before "Show all": twenty minutes in All, the first twenty busy minutes in Military.
const COLLAPSED_ROWS = 20;
const TIME_GUTTER = 44;
const ICON = 22;
const TECH_LANE = 30;
// Narrowest a player column gets before the columns scroll sideways: four icons a row.
const MIN_COLUMN = 4 * (ICON + 2) + TECH_LANE + 12;
// Military rows rarely hold more than a couple of build icons, so its columns are sized for two.
const MIN_COLUMN_MILITARY = 2 * (ICON + 2) + TECH_LANE + 12;
const AGES = [
    { key: 'feudal_age', icon: 'FeudalAge' },
    { key: 'castle_age', icon: 'CastleAge' },
    { key: 'imperial_age', icon: 'ImperialAge' },
] as const;
const AGE_RESEARCH = new Set(['Feudal Age', 'Castle Age', 'Imperial Age']);

// mgz names ("Man-at-Arms", "Double-Bit Axe") -> asset keys ("ManAtArms", "DoubleBitAxe").
function toAssetKey(name: string) {
    return name
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean)
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join('');
}

// Replay names whose icon is filed under another key: the plain Monk icon is MonkGeneric.
const ICON_ALIASES: Record<string, string> = { Monk: 'MonkGeneric' };

// Unique techs without an icon of their own get the generic Castle or Imperial one. civList
// lists each civ's unique techs as [castle, imperial].
const UNIQUE_TECH_ICONS = new Map<string, ImageSourceProp>(
    civList.flatMap((civ) => {
        const [castle, imperial] = civ.uniqueTechs ?? [];
        return [
            [castle, require('@/assets/techs/UniqueTechCastle.png')],
            [imperial, require('@/assets/techs/UniqueTechImperial.png')],
        ].filter(([tech]) => !!tech) as [string, ImageSourceProp][];
    })
);

// Military keeps what an opponent would scout for: the army, where it is made, and its upgrades.
const NON_MILITARY_UNITS = new Set(['Villager', 'Fishing Ship', 'Trade Cart', 'Trade Cog', 'Transport Ship']);
const MILITARY_BUILDINGS = new Set([
    'Barracks',
    'Archery Range',
    'Stable',
    'Siege Workshop',
    'Castle',
    'Krepost',
    'Donjon',
    'Dock',
    'Monastery',
    'Blacksmith',
    'Watch Tower',
    'Guard Tower',
    'Keep',
    'Bombard Tower',
]);
// Techs researched in the military buildings, every civ's unique techs, and the siege ones at the
// University, all from the tech tree data. Unit upgrades (Man-at-Arms, Crossbowman, ...) come
// through as techs named after the unit, so those count too.
const MILITARY_TECHS = new Set<string>([
    ...techSections
        .filter((section) => section.civ || ['Blacksmith', 'Stable', 'ArcheryRange', 'Barracks', 'Castle'].includes(section.building ?? ''))
        .flatMap((section) => section.data as string[]),
    'Ballistics',
    'Chemistry',
    'SiegeEngineers',
]);

function isMilitary(step: Step) {
    if (step.kind === 'unit') return !NON_MILITARY_UNITS.has(step.name);
    if (step.kind === 'building') return MILITARY_BUILDINGS.has(step.name);
    const key = toAssetKey(step.name);
    return MILITARY_TECHS.has(key) || !!unitIconImageDict[key];
}

function getStepIcon(step: Step): ImageSourceProp | undefined {
    const assetKey = toAssetKey(step.name);
    const key = ICON_ALIASES[assetKey] ?? assetKey;
    const dicts: Record<string, ImageSourceProp>[] =
        step.kind === 'building'
            ? [buildingIconImageDict, techIconImageDict]
            : step.kind === 'tech'
              ? [techIconImageDict, unitIconImageDict, buildingIconImageDict]
              : [unitIconImageDict];
    for (const dict of dicts) {
        if (dict[key]) return dict[key];
    }
    return step.kind === 'tech' ? UNIQUE_TECH_ICONS.get(key) : undefined;
}

function getSteps(player: Player): Step[] {
    return [
        ...(player.queuedUnits ?? []).map((u) => ({ time: getTimestampMs(u.timestamp), name: u.unit, kind: 'unit' as const, count: u.amount ?? 1 })),
        // Age research is left out: the tech lane marks the minute the age is reached instead,
        // and showing the click as well put every age icon in there twice.
        ...(player.queuedTechs ?? [])
            .filter((t) => !AGE_RESEARCH.has(t.unit))
            .map((t) => ({ time: getTimestampMs(t.timestamp), name: t.unit, kind: 'tech' as const, count: 1 })),
        ...(player.queuedBuildings ?? []).map((b) => ({ time: getTimestampMs(b.timestamp), name: b.unit, kind: 'building' as const, count: 1 })),
    ]
        .filter((s) => !!s.name)
        .sort((a, b) => a.time - b.time);
}

/** A player's steps grouped by minute, so every player's minute N lines up on one row. */
function getBuckets(steps: Step[], minutes: number): Bucket[] {
    const buckets: Bucket[] = Array.from({ length: minutes }, () => ({ build: [], techs: [] }));
    for (const step of steps) {
        const bucket = buckets[Math.min(minutes - 1, Math.floor(step.time / MINUTE))];
        if (step.kind === 'tech') {
            bucket.techs.push(step);
            continue;
        }
        const same = bucket.build.find((s) => s.kind === step.kind && s.name === step.name);
        if (same) same.count += step.count;
        else bucket.build.push({ ...step });
    }
    for (const bucket of buckets) bucket.build.sort(compareBuildSteps);
    return buckets;
}

// The same order in every minute, so a kind of icon stays in the same spot from row to row:
// villagers first, then other units, then buildings; most queued first, ties alphabetical.
function buildRank(step: Step) {
    if (step.kind === 'unit') return step.name === 'Villager' ? 0 : 1;
    return 2;
}

function compareBuildSteps(a: Step, b: Step) {
    return buildRank(a) - buildRank(b) || b.count - a.count || a.name.localeCompare(b.name);
}

/** Index of the age the player is in during a minute: 0 dark, 1 feudal, 2 castle, 3 imperial. */
function getAgeIndex(player: Player, minute: number) {
    const end = (minute + 1) * MINUTE;
    return AGES.filter((age) => {
        const uptime = player.uptimes?.find((u) => u.age === age.key);
        return uptime && getTimestampMs(uptime.timestamp) < end;
    }).length;
}

function withAlpha(hex: string, alpha: number) {
    const value = hex?.replace('#', '');
    if (!value || value.length !== 6) return hex;
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const StepIcon: React.FC<{ step: Step; size?: number }> = ({ step, size = ICON }) => {
    const icon = getStepIcon(step);
    return (
        <View style={{ width: size, height: size }} accessibilityLabel={step.count > 1 ? `${step.name} ×${step.count}` : step.name}>
            {icon ? (
                // No className here: the uniwind Image drops `style` when it gets one, and the icon vanished.
                <Image style={{ width: size, height: size }} source={icon} contentFit="contain" />
            ) : (
                <View style={{ width: size, height: size }} className="rounded-sm bg-gray-200 dark:bg-blue-800" />
            )}
            {step.count > 1 && (
                <View className="absolute -bottom-1 -right-1 rounded-sm bg-white/90 dark:bg-blue-950/90 px-0.5">
                    <Text variant="body-tn" className="tabular-nums leading-none">
                        {step.count}
                    </Text>
                </View>
            )}
        </View>
    );
};

/**
 * Every player's build order side by side on one vertical timeline: a row per minute, a column per
 * player (teams kept together), and inside each column a narrow lane for techs next to the age rail and a
 * wide lane for units and buildings. The rail on a column's left edge strengthens in the player's colour with
 * each age, and the age icon marks the minute they got there.
 */
export default function BuildOrder({ teams }: Props) {
    const getTranslation = useTranslation();
    const [showAll, setShowAll] = useState(false);
    const [mode, setMode] = useState<'all' | 'military'>('all');
    const [width, setWidth] = useState(0);
    // Row heights measured on the scrolling side, so the fixed time gutter lines up with them.
    const [rowHeights, setRowHeights] = useState<Record<number, number>>({});

    const columns = useMemo(
        () =>
            teams.map((team) =>
                team.players.map((player) => ({ player, steps: getSteps(player) }))
            ),
        [teams]
    );
    const players = useMemo(() => columns.flat(), [columns]);
    const lastTime = Math.max(0, ...players.flatMap(({ steps }) => steps.map((s) => s.time)));
    const minutes = Math.max(1, Math.floor(lastTime / MINUTE) + 1);
    // Military keeps the same minutes; only the non-military steps drop out.
    const buckets = useMemo(
        () =>
            new Map(
                players.map(({ player, steps }) => [
                    player.color,
                    getBuckets(mode === 'military' ? steps.filter(isMilitary) : steps, minutes),
                ])
            ),
        [players, minutes, mode]
    );

    if (players.length === 0) return null;

    // Military skips minutes where nobody queued anything left after the filter (an age-up still
    // counts), so the rows are the build, not long empty stretches. The time labels keep the real
    // minute, so the jumps stay visible. All keeps every minute for an even time scale.
    const allMinutes = Array.from({ length: minutes }, (_, minute) => minute);
    const timeline =
        mode === 'military'
            ? allMinutes.filter((minute) =>
                  players.some(({ player }) => {
                      const bucket = buckets.get(player.color)![minute];
                      return bucket.build.length > 0 || bucket.techs.length > 0 || getAgeIndex(player, minute) > getAgeIndex(player, minute - 1);
                  })
              )
            : allMinutes;
    const teamGaps = (columns.length - 1) * 8;
    // Columns share the width when they fit and scroll sideways (time gutter fixed) when they don't.
    const minColumn = mode === 'military' ? MIN_COLUMN_MILITARY : MIN_COLUMN;
    const columnWidth = Math.max(minColumn, Math.floor((width - TIME_GUTTER - teamGaps) / players.length));
    const rows = showAll ? timeline : timeline.slice(0, COLLAPSED_ROWS);

    return (
        <View className="gap-3 p-2" onLayout={(e) => setWidth(e.nativeEvent.layout.width - 16)}>
            <View className="flex-row flex-wrap items-end justify-between gap-2">
                <View className="shrink">
                    <Text variant="header-sm">{getTranslation('matchanalysis.buildorder.title')}</Text>
                    <Text variant="body">{getTranslation('matchanalysis.buildorder.description')}</Text>
                </View>
                <ButtonPicker
                    value={mode}
                    values={['all', 'military'] as const}
                    formatter={(v) => getTranslation(v === 'all' ? 'matchanalysis.buildorder.all' : 'matchanalysis.buildorder.military')}
                    onSelect={setMode}
                />
            </View>

            {width > 0 && (
                <View className="flex-row">
                    <View style={{ width: TIME_GUTTER }}>
                        <View style={{ height: 36 }} />
                        {rows.map((minute) => (
                            <View
                                key={minute}
                                className="justify-start pt-1 border-t border-gray-200 dark:border-gray-800"
                                style={{ height: rowHeights[minute] ?? ICON + 10 }}
                            >
                                <Text variant="body-tn" color="subtle" className="tabular-nums">
                                    {minute}:00
                                </Text>
                            </View>
                        ))}
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator className="shrink">
                        <View>
                            {/* Column headers */}
                            <View className="flex-row" style={{ height: 36, gap: 8 }}>
                                {columns.map((team, teamIndex) => (
                                    <View key={teamIndex} className="flex-row">
                                        {team.map(({ player }) => (
                                            <View key={player.color} style={{ width: columnWidth }} className="flex-row items-center gap-1 px-1">
                                                <View className="w-1 self-stretch my-1 rounded-full" style={{ backgroundColor: player.color }} />
                                                <Image className="w-4 h-4" source={cdnImageUrl(player.civImageUrl)} contentFit="contain" />
                                                <Text variant="label-sm" numberOfLines={1} className="flex-1">
                                                    {player.name}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                            {/* One row per minute; the row grows to its busiest player, so minutes stay aligned. */}
                            {rows.map((minute) => (
                                <View
                                    key={minute}
                                    className="flex-row border-t border-gray-200 dark:border-gray-800"
                                    style={{ gap: 8, minHeight: ICON + 10 }}
                                    onLayout={(e) => {
                                        const height = Math.round(e.nativeEvent.layout.height);
                                        setRowHeights((prev) => (prev[minute] === height ? prev : { ...prev, [minute]: height }));
                                    }}
                                >
                                    {columns.map((team, teamIndex) => (
                                        <View key={teamIndex} className="flex-row">
                                            {team.map(({ player }) => {
                                                const bucket = buckets.get(player.color)![minute];
                                                const ageIndex = getAgeIndex(player, minute);
                                                const agedUp = ageIndex > 0 && getAgeIndex(player, minute - 1) < ageIndex;
                                                return (
                                                    <View key={player.color} style={{ width: columnWidth }} className="flex-row">
                                                        <View style={{ width: 3, backgroundColor: withAlpha(player.color, 0.15 + ageIndex * 0.28) }} />
                                                        <View
                                                            style={{ width: TECH_LANE, gap: 2 }}
                                                            className="items-center py-1 border-r border-dashed border-gray-200 dark:border-gray-700"
                                                        >
                                                            {agedUp && (
                                                                <Image
                                                                    style={{ width: ICON, height: ICON }}
                                                                    source={getAgeIcon(AGES[ageIndex - 1].icon)}
                                                                    contentFit="contain"
                                                                />
                                                            )}
                                                            {bucket.techs.map((step, index) => (
                                                                <StepIcon key={`${step.name}-${index}`} step={step} size={ICON - 2} />
                                                            ))}
                                                        </View>
                                                        <View className="flex-1 flex-row flex-wrap content-start py-1 pl-1.5 pr-1" style={{ gap: 2, rowGap: 6 }}>
                                                            {bucket.build.map((step) => (
                                                                <StepIcon key={`${step.kind}-${step.name}`} step={step} />
                                                            ))}
                                                        </View>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            )}

            {timeline.length > COLLAPSED_ROWS && (
                <Pressable onPress={() => setShowAll(!showAll)} className="self-center py-1">
                    <Text variant="body-sm" color="link">
                        {showAll
                            ? getTranslation('matchanalysis.buildorder.showless')
                            : getTranslation('matchanalysis.buildorder.showall', { count: timeline.length })}
                    </Text>
                </Pressable>
            )}
        </View>
    );
}
