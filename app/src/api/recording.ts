import {fetchJson} from "./util";
import {IRecording} from './recording.type';
import {IMatch} from '@nex/data/api';


export async function fetchRecording(matchId: string) {
    const url = `https://s3.eu-central-1.amazonaws.com/match.aoe2companion.com/${matchId}.json`;
    console.log('fetchRecording', matchId, url);
    return await fetchJson('fetchRecording', url) as IRecording;
}

export async function hasRec(match_id: string, profile_id: number) {
    const url = `https://aoe.ms/replay/?gameId=${match_id}&profileId=${profile_id}`;

    // aoe.ms does not allow CORS
    try {
        // HEAD request to a NON-EXISTENT resource will succeed with status 404.
        const response = await fetch(url, {
            method: 'HEAD',
        });
        return response.status !== 404;
    } catch (e) {
        // HEAD request to an EXISTING resource will result in an error.
        return true;
    }
}

const asyncFilter = async <T>(arr: T[], predicate: (value: T, index: number, array: T[]) => Promise<boolean>) => {
    const results = await Promise.all(arr.map(predicate));
    return arr.filter((_v, index) => results[index]);
}

export async function hasRecDict(match: IMatch) {
    const playersWithRec = await asyncFilter(match.players, async p => p.slot_type === 1 && await hasRec(match.match_id, p.profile_id));
    return playersWithRec.map(p => p.profile_id);
}
