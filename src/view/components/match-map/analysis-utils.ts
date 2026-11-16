// Shared by MatchMap and the analysis panels it renders. Kept out of match-map.tsx so the
// panels do not import their own parent, which made a require cycle.

export function getTimestampMs(timestamp: string) {
    // timestamp = "0:12:24.994000"
    // timestamp = "0:12:24"         (microseconds is optional)
    const parts = timestamp.replace('.', ':').split(':');
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseInt(parts[2]);
    const microseconds = parseInt(parts[3] ?? 0);
    return (hours * 60 * 60 + minutes * 60 + seconds) * 1000 + microseconds/1000;
}

export type ILegendInfo = {
    teamId?: number
    players: {
        profileId: number
        name: string
        civImageUrl: string
        color: string
        eapmPerMinute?: Record<string, number>
        resignation?: {
            payload: {
                sequence: number
            }
            player: number
            timestamp: string
            type: string
        }
        uptimes?: {
            timestamp: string
            age: string
        }[]
        timeseries?: {
            timestamp: string
            totalObjects: number
            totalResources: number
        }[]
        queuedUnits?: { timestamp: string; unit: string; amount?: number }[]
        queuedTechs?: { timestamp: string; unit: string }[]
        queuedBuildings?: { timestamp: string; unit: string }[]
        averageEapm?: number
    }[]
}[]
