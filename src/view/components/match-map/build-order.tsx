import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Image } from '@/src/components/uniwind/image';
import type { ImageSourceProp } from '@app/components/uniwind/image';
import { Text } from '@app/components/text';
import { cdnImageUrl } from '@app/helper/maps';
import { getTimestampMs, ILegendInfo } from '@app/view/components/match-map/match-map';
import { formatTimeFromMs } from '@app/view/components/match-map/map-util';
import { useTranslation } from '@app/helper/translate';
import { unitIconImageDict } from '@/assets/units';
import { techIconImageDict } from '@/assets/techs';
import { buildingIconImageDict } from '@/assets/buildings';

interface Props {
    teams: ILegendInfo;
}

type Kind = 'unit' | 'tech' | 'building';

interface Step {
    time: number;
    name: string;
    kind: Kind;
    count: number;
}

// Rows shown before "Show all"; a full match easily has several hundred steps.
const COLLAPSED_ROWS = 40;

// mgz names ("Man-at-Arms", "Double-Bit Axe") -> asset keys ("ManAtArms", "DoubleBitAxe").
function toAssetKey(name: string) {
    return name
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean)
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join('');
}

function getStepIcon(step: Step): ImageSourceProp | undefined {
    const key = toAssetKey(step.name);
    const dicts: Record<string, ImageSourceProp>[] =
        step.kind === 'building'
            ? [buildingIconImageDict, techIconImageDict]
            : step.kind === 'tech'
              ? [techIconImageDict, unitIconImageDict, buildingIconImageDict]
              : [unitIconImageDict];
    for (const dict of dicts) {
        if (dict[key]) return dict[key];
    }
    return undefined;
}

export function getBuildOrder(player: ILegendInfo[number]['players'][number]): Step[] {
    const steps: Step[] = [
        ...(player.queuedUnits ?? []).map((u) => ({
            time: getTimestampMs(u.timestamp),
            name: u.unit,
            kind: 'unit' as const,
            count: u.amount ?? 1,
        })),
        ...(player.queuedTechs ?? []).map((t) => ({
            time: getTimestampMs(t.timestamp),
            name: t.unit,
            kind: 'tech' as const,
            count: 1,
        })),
        ...(player.queuedBuildings ?? []).map((b) => ({
            time: getTimestampMs(b.timestamp),
            name: b.unit,
            kind: 'building' as const,
            count: 1,
        })),
    ].filter((s) => !!s.name);

    steps.sort((a, b) => a.time - b.time);

    // Consecutive steps of the same thing read as one line: "Villager ×4", "Farm ×6".
    const merged: Step[] = [];
    for (const step of steps) {
        const prev = merged[merged.length - 1];
        if (prev && prev.kind === step.kind && prev.name === step.name && step.kind !== 'tech') {
            prev.count += step.count;
        } else {
            merged.push({ ...step });
        }
    }
    return merged;
}

export default function BuildOrder({ teams }: Props) {
    const getTranslation = useTranslation();
    const players = useMemo(() => teams.flatMap((team) => team.players), [teams]);
    const [selectedColor, setSelectedColor] = useState(players[0]?.color);
    const [showAll, setShowAll] = useState(false);

    const player = players.find((p) => p.color === selectedColor) ?? players[0];
    const steps = useMemo(() => (player ? getBuildOrder(player) : []), [player]);

    if (!player) return null;

    const visible = showAll ? steps : steps.slice(0, COLLAPSED_ROWS);

    return (
        <View className="gap-2 p-2">
            <Text variant="header-sm">{getTranslation('matchanalysis.buildorder.title')}</Text>
            <Text variant="body">{getTranslation('matchanalysis.buildorder.description')}</Text>

            <View className="flex-row flex-wrap gap-1.5">
                {players.map((p) => {
                    const selected = p.color === player.color;
                    return (
                        <Pressable
                            key={p.color}
                            onPress={() => setSelectedColor(p.color)}
                            className={`flex-row items-center gap-1 rounded-full border px-2 py-1 ${
                                selected ? 'border-gold-500 bg-gold-100 dark:bg-gold-700' : 'border-gray-300 dark:border-gray-700'
                            }`}
                        >
                            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                            <Image className="w-4 h-4" source={cdnImageUrl(p.civImageUrl)} contentFit="contain" />
                            <Text variant="body-sm">{p.name}</Text>
                        </Pressable>
                    );
                })}
            </View>

            <View className="gap-0.5">
                {visible.map((step, index) => {
                    const icon = getStepIcon(step);
                    return (
                        <View key={index} className="flex-row items-center gap-2">
                            <Text variant="body-sm" color="subtle" className="w-14 text-right">
                                {formatTimeFromMs(step.time)}
                            </Text>
                            {icon ? (
                                <Image className="w-5 h-5" source={icon} contentFit="contain" />
                            ) : (
                                <View className="w-5 h-5" />
                            )}
                            <Text variant="body-sm" className="flex-1">
                                {step.name}
                                {step.count > 1 ? ` ×${step.count}` : ''}
                            </Text>
                        </View>
                    );
                })}
            </View>

            {steps.length > COLLAPSED_ROWS && (
                <Pressable onPress={() => setShowAll(!showAll)} className="self-center py-1">
                    <Text variant="body-sm" color="link">
                        {showAll
                            ? getTranslation('matchanalysis.buildorder.showless')
                            : getTranslation('matchanalysis.buildorder.showall', { count: steps.length })}
                    </Text>
                </Pressable>
            )}
        </View>
    );
}
