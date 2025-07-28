import {makeQueryString, setAoeReferenceData} from '@nex/data';
import {fetchJson} from '../api/util';
// import * as FileSystem from 'expo-file-system';
// import {cacheDirectory, getInfoAsync, writeAsStringAsync} from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';

// export async function downloadOrGetFromCache(remoteURI: string, cacheKey: string) {
//     const filesystemURI = FileSystem.cacheDirectory + '/'  + cacheKey;
//     try {
//         const metadata = await FileSystem.getInfoAsync(filesystemURI);
//         if (metadata.exists) {
//             const result = await FileSystem.readAsStringAsync(filesystemURI);
//             return JSON.parse(result);
//         }
//         const imageObject = await FileSystem.downloadAsync(
//             remoteURI,
//             filesystemURI
//         );
//         this.setState({
//             imgURI: imageObject.uri
//         });
//     }
//     catch (err) {
//         console.log('Image loading error:', err);
//         this.setState({ imgURI: remoteURI });
//     }
// }

// export async function fetchJsonOrGetFromCache(cacheKey: string, url: string, cacheTimeInSeconds: number) {
//     const filesystemURI = cacheDirectory + '/'  + cacheKey;
//     try {
//         const metadata = await getInfoAsync(filesystemURI);
//         console.log('=> metadata', metadata);
//         if (metadata.exists && metadata.modificationTime) {
//             // const result = await FileSystem.readAsStringAsync(filesystemURI);
//             // return JSON.parse(result);
//             return {};
//         }
//
//         const json = await fetchJson('fetch ' + cacheKey, url);
//         await writeAsStringAsync(filesystemURI, JSON.stringify(json));
//
//         // const imageObject = await FileSystem.downloadAsync(
//         //     remoteURI,
//         //     filesystemURI
//         // );
//         // this.setState({
//         //     imgURI: imageObject.uri
//         // });
//     }
//     catch (err) {
//         // console.log('Image loading error:', err);
//         // this.setState({ imgURI: remoteURI });
//     }
//     return {};
// }
// const json = await fetchJsonOrGetFromCache('aoe-reference-data', requestUrl, 60);

export const useAoeReferenceData = () =>
    useQuery({
        queryKey: ['reference-data'],
        staleTime: 0,
        queryFn: fetchAoeReferenceData,
    });

export async function fetchAoeReferenceData() {
    console.log('fetchAoeReferenceData');
    // await sleep(5000);

    try {
        const url = 'https://raw.githubusercontent.com/SiegeEngineers/aoc-reference-data/master/data/players.yaml';
        const queryString = makeQueryString({
            url,
        });
        const requestUrl = `https://yaml-to-json.vercel.app/api/convert?${queryString}`;
        const json = await fetchJson(requestUrl);
        // setAoeReferenceData({ players: json });
        return json;
    } catch (err) {

    }
}
