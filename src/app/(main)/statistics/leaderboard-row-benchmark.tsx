import { Button } from '@app/components/button';
import { LeaderboardRow, LeaderboardRowLegacy, useLeaderboardGamesLabel, useLeaderboardRowStyles } from '@app/components/leaderboard/leaderboard-row';
import { Text } from '@app/components/text';
import { containerClassName } from '@app/styles';
import { Stack } from 'expo-router';
import React, { Profiler, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { ILeaderboardPlayer } from '../../../api/helper/api.types';

/**
 * A bench for the leaderboard row, because the row is what the leaderboard costs:
 * a commit there is rows-rendered x per-row cost, and the commit that hurts is the
 * one where a page lands and fifty skeleton rows turn into fifty rows with data.
 * This page reproduces exactly that transition, on demand, with no network and no
 * list virtualization in the way, and times it.
 *
 * Measured per run:
 *   js     the state flip -> useLayoutEffect after the commit carrying the data.
 *          React render + commit, i.e. the part that blocks the JS thread.
 *   frame  the same start -> second requestAnimationFrame after that commit, so it
 *          also covers native layout and getting the frame out.
 *   react  <Profiler> actualDuration for the row subtree. Dev builds only — React
 *          does not call onRender in a release build.
 *
 * `frame` is the number that matches what the eye sees, `js` is the one that moves
 * when the row itself gets cheaper. Numbers only compare within one device and one
 * build: a dev build, with the Profiler live and a debugger attached, is several
 * times slower than release.
 */

const ROW_COUNT = 50;

// A 1x1 transparent PNG. Real avatar URLs would drag network latency into every
// run; this still mounts and decodes an <Image> per row.
const AVATAR_URI =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

const NAMES = ['Hera', 'TheViper', 'Liereyy', 'MbL', 'Yo', 'Villese', 'DauT', 'TheMax', 'Vinchester', 'ACCM', 'Nicov', 'JorDan_AoE', 'Tim', 'Modri'];

// Built once at module load: a run must time rendering, not data generation, and a
// stable array identity keeps React.memo honest between runs.
const PLAYERS: (ILeaderboardPlayer | undefined)[] = Array.from({ length: ROW_COUNT }, (_, i) => ({
    clan: i % 3 === 0 ? 'GL' : '',
    leaderboardId: 3,
    profileId: 100000 + i,
    name: `${NAMES[i % NAMES.length]}${i % 4 === 0 ? `_${i}` : ''}`,
    rank: i + 1,
    rankCountry: i + 1,
    rating: 2600 - i * 7,
    maxRating: 2700 - i * 7,
    lastMatchTime: new Date(),
    streak: 0,
    wins: 900 + i,
    losses: 700 + i,
    drops: 0,
    updatedAt: '',
    games: 1600 + i * 3,
    country: 'de',
    avatarSmallUrl: AVATAR_URI,
}));

const EMPTY: (ILeaderboardPlayer | undefined)[] = Array.from({ length: ROW_COUNT }, () => undefined);

type Variant = 'current' | 'legacy';

const variantLabels: Record<Variant, string> = {
    current: 'Current row',
    legacy: 'Legacy row',
};

interface Sample {
    js: number;
    frame: number;
    react?: number;
}

const now = () => (typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now());

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const settle = async (frames: number) => {
    for (let i = 0; i < frames; i++) {
        await nextFrame();
    }
};

const noopSelect = () => {};

// ---------------------------------------------------------------------------
// The thing under test
// ---------------------------------------------------------------------------

// Memoized so that recording a sample — which re-renders the page around it —
// cannot re-render the rows and pollute the next measurement. The only prop change
// that reaches it is the one being timed.
const RowList = React.memo(function RowList({ variant, loaded }: { variant: Variant; loaded: boolean }) {
    const styles = useLeaderboardRowStyles();
    const gamesLabel = useLeaderboardGamesLabel();
    const { width } = useWindowDimensions();
    const players = loaded ? PLAYERS : EMPTY;

    if (variant === 'legacy') {
        return (
            <>
                {players.map((player, i) => (
                    <LeaderboardRowLegacy key={i} player={player} i={i} leaderboardCountry={null} authProfileId={null} onSelect={noopSelect} />
                ))}
            </>
        );
    }

    return (
        <>
            {players.map((player, i) => (
                <LeaderboardRow
                    key={i}
                    player={player}
                    i={i}
                    showCountryRank={false}
                    showGames={width >= 360}
                    gamesLabel={gamesLabel}
                    authProfileId={null}
                    rankWidth={43}
                    styles={styles}
                    onSelect={noopSelect}
                />
            ))}
        </>
    );
});

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

interface Stats {
    n: number;
    mean: number;
    median: number;
    p95: number;
    min: number;
    max: number;
}

function quantile(sorted: number[], q: number) {
    const pos = (sorted.length - 1) * q;
    const lower = Math.floor(pos);
    const upper = Math.ceil(pos);
    if (lower === upper) return sorted[lower];
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (pos - lower);
}

function stats(values: number[]): Stats {
    if (values.length === 0) return { n: 0, mean: 0, median: 0, p95: 0, min: 0, max: 0 };
    const sorted = [...values].sort((a, b) => a - b);
    return {
        n: values.length,
        mean: values.reduce((sum, value) => sum + value, 0) / values.length,
        median: quantile(sorted, 0.5),
        p95: quantile(sorted, 0.95),
        min: sorted[0],
        max: sorted[sorted.length - 1],
    };
}

const ms = (value: number) => `${value.toFixed(1)} ms`;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LeaderboardRowBenchmarkPage() {
    const [variant, setVariant] = useState<Variant>('current');
    const [loaded, setLoaded] = useState(false);
    const [running, setRunning] = useState(false);
    const [samples, setSamples] = useState<Record<Variant, Sample[]>>({ current: [], legacy: [] });
    const [last, setLast] = useState<Sample | null>(null);

    // Written right before the state flip and read back in the layout effect below.
    // A promise resolver is the only way to hand a value from a commit back to the
    // async function that triggered it.
    const pending = useRef<{ t0: number; resolve: (sample: Sample) => void } | null>(null);
    const reactDuration = useRef<number | undefined>(undefined);

    // useLayoutEffect, not useEffect: it runs in the same task as the commit, so
    // nothing else can land in between and inflate the number.
    useLayoutEffect(() => {
        const request = pending.current;
        if (!request || !loaded) return;
        pending.current = null;
        const js = now() - request.t0;
        const react = reactDuration.current;
        // Two frames: the first is scheduled from inside the commit and can still
        // run before the frame reaches the screen.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                request.resolve({ js, frame: now() - request.t0, react });
            });
        });
    }, [loaded]);

    const onRowsRender = useCallback((_id: string, _phase: string, actualDuration: number) => {
        reactDuration.current = actualDuration;
    }, []);

    const measureOnce = async () => {
        setLoaded(false);
        // Let the skeleton commit finish, otherwise its work lands inside the
        // window being timed.
        await settle(3);
        reactDuration.current = undefined;
        return new Promise<Sample>((resolve) => {
            const t0 = now();
            pending.current = { t0, resolve };
            setLoaded(true);
        });
    };

    const record = (sample: Sample) => {
        setLast(sample);
        setSamples((current) => ({ ...current, [variant]: [...current[variant], sample] }));
    };

    const runBatch = async (count: number) => {
        if (running) return;
        setRunning(true);
        for (let i = 0; i < count; i++) {
            record(await measureOnce());
            await settle(2);
        }
        setRunning(false);
    };

    // The manual button: flip the state and watch it on a real device, with the
    // measurement taken from the same code path the batch runs use.
    const toggle = async () => {
        if (running) return;
        if (loaded) {
            setLoaded(false);
            return;
        }
        setRunning(true);
        record(await measureOnce());
        setRunning(false);
    };

    const clear = () => {
        if (running) return;
        setSamples((current) => ({ ...current, [variant]: [] }));
        setLast(null);
    };

    const switchVariant = (next: Variant) => {
        if (running) return;
        setVariant(next);
        setLoaded(false);
        setLast(null);
    };

    const currentSamples = samples[variant];
    const jsStats = stats(currentSamples.map((sample) => sample.js));
    const frameStats = stats(currentSamples.map((sample) => sample.frame));
    const reactStats = stats(currentSamples.map((sample) => sample.react).filter((value): value is number => value != null));

    const legacyMedian = stats(samples.legacy.map((sample) => sample.js)).median;
    const currentMedian = stats(samples.current.map((sample) => sample.js)).median;
    const bothMeasured = samples.legacy.length > 0 && samples.current.length > 0;
    const delta = legacyMedian === 0 ? 0 : ((currentMedian - legacyMedian) / legacyMedian) * 100;

    return (
        <View className="flex-1">
            <Stack.Screen options={{ title: 'Row benchmark' }} />

            <View className={`gap-3 py-3 ${containerClassName}`}>
                <View className="flex-row gap-2">
                    {(['current', 'legacy'] as Variant[]).map((option) => (
                        <Button
                            key={option}
                            size="small"
                            className={variant === option ? '' : 'opacity-40'}
                            onPress={() => switchVariant(option)}
                        >
                            {variantLabels[option]}
                        </Button>
                    ))}
                </View>

                <View className="flex-row flex-wrap gap-2">
                    <Button size="small" onPress={toggle}>
                        {loaded ? 'Show skeleton' : 'Show data (measure)'}
                    </Button>
                    <Button size="small" onPress={() => runBatch(10)}>
                        Run 10x
                    </Button>
                    <Button size="small" onPress={() => runBatch(30)}>
                        Run 30x
                    </Button>
                    <Button size="small" onPress={clear}>
                        Clear
                    </Button>
                </View>

                <Text variant="body-sm" color="subtle">
                    {ROW_COUNT} rows, skeleton {'→'} data, {variantLabels[variant].toLowerCase()}
                    {running ? ' — running…' : ''}
                </Text>

                <View className="flex-row gap-4">
                    <Metric label="js" value={last ? ms(last.js) : '—'} sub={last ? `${((last.js / ROW_COUNT) * 1000).toFixed(0)} µs/row` : ' '} />
                    <Metric label="frame" value={last ? ms(last.frame) : '—'} sub="incl. native layout" />
                    <Metric label="react" value={last?.react != null ? ms(last.react) : 'n/a'} sub="Profiler, dev only" />
                </View>

                <View className="gap-0.5">
                    <View className="flex-row">
                        <View className="w-16" />
                        <Text variant="label-sm" color="subtle" className="w-8 text-right">
                            n
                        </Text>
                        {['mean', 'med', 'p95', 'min', 'max'].map((header) => (
                            <Text key={header} variant="label-sm" color="subtle" className="flex-1 text-right">
                                {header}
                            </Text>
                        ))}
                    </View>
                    <StatsRow label="js" stats={jsStats} />
                    <StatsRow label="frame" stats={frameStats} />
                    {reactStats.n > 0 && <StatsRow label="react" stats={reactStats} />}
                </View>

                {bothMeasured ? (
                    <Text variant="body-sm">
                        median js: legacy {ms(legacyMedian)} {'→'} current {ms(currentMedian)} ({delta > 0 ? '+' : ''}
                        {delta.toFixed(0)}%)
                    </Text>
                ) : (
                    <Text variant="body-xs" color="subtle">
                        Run both variants to compare. Numbers are comparable only within one device and one build.
                    </Text>
                )}
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
                <Profiler id="leaderboard-rows" onRender={onRowsRender}>
                    <RowList variant={variant} loaded={loaded} />
                </Profiler>
            </ScrollView>
        </View>
    );
}

function Metric({ label, value, sub }: { label: string; value: string; sub: string }) {
    return (
        <View className="flex-1">
            <Text variant="label-sm" color="subtle">
                {label}
            </Text>
            <Text variant="header-sm">{value}</Text>
            <Text variant="body-xs" color="subtle">
                {sub}
            </Text>
        </View>
    );
}

function StatsRow({ label, stats: values }: { label: string; stats: Stats }) {
    return (
        <View className="flex-row">
            <Text variant="label-sm" className="w-16">
                {label}
            </Text>
            <Text variant="body-sm" className="w-8 text-right">
                {values.n}
            </Text>
            {[values.mean, values.median, values.p95, values.min, values.max].map((value, index) => (
                <Text key={index} variant="body-sm" className="flex-1 text-right">
                    {values.n === 0 ? '—' : value.toFixed(1)}
                </Text>
            ))}
        </View>
    );
}
