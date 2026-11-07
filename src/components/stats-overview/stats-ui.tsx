import { Text } from '@app/components/text';
import { getCivIconLocal } from '@app/helper/civs';
import React from 'react';
import { Image, ScrollView, View } from 'react-native';

export const pct = (value: number) => `${(value * 100).toFixed(1)}%`;

// Red below 50%, green above; saturates at +-8 points, which is about the spread a
// matchup table shows once it has enough games.
export function winRateColor(winRate: number) {
    const t = Math.max(-1, Math.min(1, (winRate - 0.5) / 0.08));
    const hue = 60 + t * 60;
    return `hsl(${hue}, 70%, 45%)`;
}

export const CivIcon: React.FC<{ civ: string; size?: number }> = ({ civ, size = 20 }) => (
    <Image source={getCivIconLocal(civ)} style={{ width: size, height: size }} />
);

/**
 * A win-rate grid: one row per `rows` entry, one column per `columns` entry, each
 * cell coloured by `value(row, column)`. null renders an empty (mirror / no data)
 * cell. Scrolls horizontally once it is wider than the screen.
 */
export function WinRateHeatmap<R extends string, C extends string>({
    rows,
    columns,
    value,
    rowHeader,
    columnHeader,
    rowHeaderWidth = 34,
    cell = 34,
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
                    <View key={row} className={`flex-row rounded ${highlightRow === row ? 'bg-gold-500/20' : ''}`}>
                        <View style={{ width: rowHeaderWidth, height: cell }} className="justify-center">
                            {rowHeader(row)}
                        </View>
                        {columns.map((column) => {
                            const v = value(row, column);
                            return (
                                <View
                                    key={column}
                                    style={{ width: cell - 2, height: cell - 2, margin: 1, backgroundColor: v == null ? 'transparent' : winRateColor(v) }}
                                    className="items-center justify-center rounded-sm"
                                >
                                    <Text variant="body-tn" className="text-white!">
                                        {v == null ? '–' : Math.round(v * 100)}
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

export const WinRateLegend: React.FC = () => (
    <View className="flex-row flex-wrap gap-3 items-center">
        {[
            { label: 'Low WR', value: 0.42 },
            { label: '~50%', value: 0.5 },
            { label: 'High WR', value: 0.58 },
        ].map((item) => (
            <View key={item.label} className="flex-row items-center gap-1">
                <View className="w-3 h-3 rounded-full" style={{ backgroundColor: winRateColor(item.value) }} />
                <Text variant="body-xs" color="subtle">
                    {item.label}
                </Text>
            </View>
        ))}
    </View>
);
