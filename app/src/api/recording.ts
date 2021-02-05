import {fetchJson} from "./util";
import {IRecording} from './recording.type';


export async function fetchRecording(matchId: string) {
    const url = `https://s3.eu-central-1.amazonaws.com/match.aoe2companion.com/${matchId}.json`;
    console.log('fetchRecording', matchId, url);
    return await fetchJson('fetchRecording', url) as IRecording;
}
