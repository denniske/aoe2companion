import { Text } from '@app/components/text';
import { getCivIconLocal } from '@app/helper/civs';
import { cdnImageUrl } from '@app/helper/maps';
import React from 'react';
import { Image, ScrollView, View } from 'react-native';

/*
 * The statistics pages' visual language, deliberately the app's own rather than the
 * usual red/yellow/green: a civ's result is shown as its *edge* over an even 50%,
 * gold when it is stronger and steel blue when it is weaker. Two hues that both
 * belong to the app's palette, and that stay distinguishable for red-green colour
 * blindness.
 */

// Edges past this many percentage points get the full colour; matchup and map
// tables rarely spread wider once they have enough games.
const FULL_EDGE = 0.08;

const GOLD = '249, 184, 6'; // gold-500
const STEEL = '103, 118, 166'; // blue-400

// uniwind does not apply alpha modifiers (bg-gold-500/40) to the app's custom
// palette, so translucent gold is written out as an inline colour instead.
export const goldAlpha = (alpha: number) => `rgba(${GOLD}, ${alpha})`;

export const pct = (value: number) => `${(value * 100).toFixed(1)}%`;

/** Signed points over 50%: 0.537 -> "+3.7". */
export function formatEdge(winRate: number, digits = 1) {
    const points = (winRate - 0.5) * 100;
    const rounded = points.toFixed(digits);
    if (Number(rounded) === 0) return digits === 0 ? '0' : (0).toFixed(digits);
    return points > 0 ? `+${rounded}` : `−${rounded.slice(1)}`;
}

/** Gold or steel at an opacity that grows with the edge. */
export function edgeFill(winRate: number, maxAlpha = 0.85) {
    const edge = winRate - 0.5;
    const alpha = Math.min(1, Math.abs(edge) / FULL_EDGE) * maxAlpha;
    return `rgba(${edge >= 0 ? GOLD : STEEL}, ${alpha.toFixed(3)})`;
}

const edgeTextClass = (winRate: number) =>
    Math.abs(winRate - 0.5) < 0.005 ? 'text-subtle' : winRate > 0.5 ? 'text-gold-700! dark:text-gold-400!' : 'text-blue-500! dark:text-blue-300!';

/** A win rate in the edge colours, either as "53.7%" or as "+3.7". */
export const EdgeText: React.FC<{ winRate: number; mode?: 'percent' | 'edge'; variant?: 'label-sm' | 'label' | 'body-xs' | 'label-xs' }> = ({
    winRate,
    mode = 'percent',
    variant = 'label-sm',
}) => (
    <Text variant={variant} className={`${edgeTextClass(winRate)} tabular-nums`}>
        {mode === 'percent' ? pct(winRate) : formatEdge(winRate)}
    </Text>
);

/**
 * A bar centred on 50%: gold grows right for a stronger civ, steel grows left for a
 * weaker one. Reads as "how far from even" at a glance, which a 0-100% bar of values
 * that all sit between 45% and 55% cannot show.
 */
export const BalanceBar: React.FC<{ winRate: number; className?: string }> = ({ winRate, className }) => {
    const edge = winRate - 0.5;
    // Share of one half, so a full-colour edge fills its whole side.
    const width = `${Math.min(1, Math.abs(edge) / FULL_EDGE) * 100}%` as const;
    return (
        <View className={`h-1.5 rounded-full bg-gray-200 dark:bg-blue-800 flex-row items-center ${className ?? ''}`}>
            <View className="flex-1 h-full flex-row justify-end">
                {edge < 0 && <View className="h-full rounded-l-full" style={{ width, backgroundColor: `rgb(${STEEL})` }} />}
            </View>
            <View className="w-0.5 h-3 rounded-full bg-gray-400 dark:bg-blue-400" />
            <View className="flex-1 h-full flex-row">
                {edge > 0 && <View className="h-full rounded-r-full" style={{ width, backgroundColor: `rgb(${GOLD})` }} />}
            </View>
        </View>
    );
};

/** A plain share bar (play rate, players), in the app's gold. */
export const ShareBar: React.FC<{ fraction: number; className?: string }> = ({ fraction, className }) => (
    <View className={`h-1.5 rounded-full bg-gray-200 dark:bg-blue-800 overflow-hidden ${className ?? ''}`}>
        <View className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(1, fraction)) * 100}%`, backgroundColor: goldAlpha(0.75) }} />
    </View>
);

export const CivIcon: React.FC<{ civ: string; size?: number }> = ({ civ, size = 20 }) => (
    <Image source={getCivIconLocal(civ)} style={{ width: size, height: size }} />
);

// Mock map names to the CDN image the maps API serves for them. Once the stats come
// from the backend, the response carries mapImageUrl and this goes away.
const MAP_IMAGE_IDS: Record<string, string> = {
    'Arabia': 'rm_arabia',
    'Arena': 'rm_arena',
    'Arabian Desert': 'rm_arabian_desert',
    'Nomad': 'rm_nomad',
    'Glade': 'rm_glade',
    'Haboob': 'rm_haboob',
    'Socotra': 'rm_socotra',
    'Megarandom': 'rm_megarandom',
    'Steppe': 'rm_steppe',
    'Enclosed': 'rm_enclosed',
    'Four Lakes': 'rm_four-lakes',
    'Acropolis': 'rm_acropolis',
    'Black Forest': 'rm_black-forest',
    'Golden Pit': 'rm_golden-pit',
    'Hill Fort': 'rm_hill-fort',
};

export const MapThumb: React.FC<{ map: string; size?: number }> = ({ map, size = 32 }) => {
    const id = MAP_IMAGE_IDS[map];
    const uri = id ? cdnImageUrl(`https://backend.cdn.aoe2companion.com/public/aoe2/de/maps/${id}.png`, 'thumb') : undefined;
    return uri ? <Image source={{ uri }} style={{ width: size, height: size }} resizeMode="contain" /> : <View style={{ width: size, height: size }} />;
};

/** A section heading with the gold rule the stats pages use to separate blocks. */
export const SectionTitle: React.FC<{ title: string; right?: React.ReactNode }> = ({ title, right }) => (
    <View className="flex-row items-center gap-2">
        <View className="w-1 h-5 rounded-full bg-gold-500" />
        <Text variant="header-sm" className="flex-1">
            {title}
        </Text>
        {right}
    </View>
);

/**
 * A win-rate grid: one row per `rows` entry, one column per `columns` entry. Each
 * tile shows the plain win rate -- easier to read across a large grid than signed
 * points -- and is tinted gold/steel by its edge over 50%. null is a mirror
 * or empty cell. Scrolls horizontally once it is wider than the screen.
 */
export function WinRateHeatmap<R extends string, C extends string>({
    rows,
    columns,
    value,
    rowHeader,
    columnHeader,
    rowHeaderWidth = 34,
    cell = 36,
    highlightRow,
}: {
    rows: R[];
    columns: C[];
    value: (row: R, column: C) => number | null;
    rowHeader: (row: R) => React.ReactNode;
    columnHeader: (column: C) => React.ReactNode;
    rowHeaderWidth?: number;
    cell?: number;
    highlightRow?: R | null;
}) {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator>
            <View>
                <View className="flex-row">
                    <View style={{ width: rowHeaderWidth, height: cell }} />
                    {columns.map((column) => (
                        <View key={column} style={{ width: cell, height: cell }} className="items-center justify-center">
                            {columnHeader(column)}
                        </View>
                    ))}
                </View>
                {rows.map((row) => (
                    <View key={row} className="flex-row rounded-lg" style={highlightRow === row ? { backgroundColor: goldAlpha(0.15) } : undefined}>
                        <View style={{ width: rowHeaderWidth, height: cell }} className="justify-center">
                            {rowHeader(row)}
                        </View>
                        {columns.map((column) => {
                            const v = value(row, column);
                            return (
                                <View
                                    key={column}
                                    style={{ width: cell - 4, height: cell - 4, margin: 2, backgroundColor: v == null ? 'transparent' : edgeFill(v) }}
                                    className={`items-center justify-center rounded-md ${v == null ? '' : 'border border-gray-200/60 dark:border-blue-800'}`}
                                >
                                    {/* Dark text once the gold is strong enough to wash out white. */}
                                    <Text variant="body-tn" className={`tabular-nums ${v != null && v - 0.5 > FULL_EDGE * 0.6 ? 'text-blue-950!' : ''}`}>
                                        {v == null ? '' : `${Math.round(v * 100)}%`}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

/** The heatmap key: a strip from below 50% to above it. */
export const EdgeLegend: React.FC = () => (
    <View className="flex-row items-center gap-2">
        <Text variant="body-xs" color="subtle">
            below 50%
        </Text>
        <View className="flex-row rounded overflow-hidden">
            {[-0.08, -0.05, -0.02, 0, 0.02, 0.05, 0.08].map((edge) => (
                <View key={edge} className="w-4 h-3 border-r border-white/10" style={{ backgroundColor: edge === 0 ? 'transparent' : edgeFill(0.5 + edge) }} />
            ))}
        </View>
        <Text variant="body-xs" color="subtle">
            above 50% · win rate
        </Text>
    </View>
);
