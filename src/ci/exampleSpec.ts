import { captureImage } from './capture';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { appConfig } from '@nex/dataset';

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function capture(name: string) {
    console.log('CAPTURE', name);
    await captureImage(name);
}

const waitTime = 2000;

function routeToScreenshotName(route: string) {
    route = route.replace(/^\//g, '');
    route = route.replace(/\//g, '-');
    route = route.replace(/\?/g, '-');
    route = route.replace(/=/g, '-');
    // if (route.includes('?')) {
    //     route = route.substring(0, route.indexOf('?'));
    // }
    return route;
}

export default function(spec: any) {

    spec.describe('App', function() {

        spec.it('all', async function() {
            await AsyncStorage.removeItem('settings');

            let searchPlayerName = '', searchPlayerId = '', searchCiv = '';
            if (appConfig.game === 'aoe2') {
                await AsyncStorage.setItem('following', '[{"id":"76561197984749679-196240","steam_id":"76561197984749679","profile_id":196240,"name":"GL.TheViper","games":2243,"country":"NO"},{"id":"76561198011417995-254415","steam_id":"76561198011417995","profile_id":254415,"name":"Modri","games":1168,"country":"SI"},{"id":"76561198083128303-2413974","steam_id":"76561198083128303","profile_id":2413974,"name":"Roggy","games":2298,"country":"TR"}]');
                searchPlayerName = 'Hera';
                searchPlayerId = '199325';
                searchCiv = 'Aztecs';
            }
            if (appConfig.game === 'aoe4') {
                await AsyncStorage.setItem('following', '[{"profileId":3592906,"profile_id":3592906,"name":"David Kim","games":3916,"country":"ca"}]');
                searchPlayerName = 'Beasty';
                searchPlayerId = '1270139';
                searchCiv = 'HolyRomanEmpire';
            }

            // await AsyncStorage.setItem('settings', '{"id":"199325","profile_id":199325}');
            // console.log(await AsyncStorage.getItem('following'));

            let route: string;

            route = `/matches`;
            router.navigate(route as any);
            await sleep(waitTime * 2);
            await capture('1-' + routeToScreenshotName(route));
            await sleep(1000);

            route = `/matches/users/select?search=${searchPlayerName}`;
            router.navigate(route as any);
            await sleep(waitTime*2);
            await capture('2-' + routeToScreenshotName(route));
            await sleep(1000);

            route = `/matches/users/${searchPlayerId}`;
            router.navigate(route as any);
            await sleep(waitTime*3);
            await capture('3-' + routeToScreenshotName(route));
            await sleep(1000);

            route = `/matches/users/${searchPlayerId}?tab=MainStats`;
            router.navigate(route as any);
            await sleep(waitTime*2);
            await capture('4-' + routeToScreenshotName(route));
            await sleep(1000);

            route = `/matches/users/${searchPlayerId}?tab=MainMatches`;
            router.navigate(route as any);
            await sleep(waitTime*2);
            await capture('5-' + routeToScreenshotName(route));
            await sleep(1000);

            route = `/statistics`;
            router.navigate(route as any);
            await sleep(waitTime*2);
            await capture('6-' + routeToScreenshotName(route));
            await sleep(1000);

            route = `/explore/civilizations/${searchCiv}`;
            router.navigate(route as any);
            await sleep(waitTime*2);
            await capture('7-' + routeToScreenshotName(route));
            await sleep(1000);

            if (appConfig.game === 'aoe2') {
                route = `/explore/build-orders/17?focusMode=true`;
                router.navigate(route as any);
                await sleep(waitTime * 2);
                await capture('8-' + routeToScreenshotName(route));
                await sleep(1000);
            }
        });
    });
}
