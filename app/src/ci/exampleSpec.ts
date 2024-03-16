import {captureImage} from "./capture";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

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

export default function (spec: any) {

    spec.describe('App', function () {

        spec.it('all', async function () {
            await AsyncStorage.removeItem('settings');
            await AsyncStorage.setItem('following', '[{"id":"76561197984749679-196240","steam_id":"76561197984749679","profile_id":196240,"name":"GL.TheViper","games":2243,"country":"NO"},{"id":"76561198011417995-254415","steam_id":"76561198011417995","profile_id":254415,"name":"Modri","games":1168,"country":"SI"},{"id":"76561198083128303-2413974","steam_id":"76561198083128303","profile_id":2413974,"name":"Roggy","games":2298,"country":"TR"}]');
            // await AsyncStorage.setItem('settings', '{"id":"199325","profile_id":199325}');
            // console.log(await AsyncStorage.getItem('following'));

            let route: string;

            route = `/matches`;
            router.navigate(route);
            await sleep(waitTime*2);
            await capture('1-' + routeToScreenshotName(route));
            await sleep(1000);

            route = `/matches/users/select?search=Hera`;
            router.navigate(route);
            await sleep(waitTime*2);
            await capture('2-' + routeToScreenshotName(route));
            await sleep(1000);

            route = `/matches/users/199325`;
            router.navigate(route);
            await sleep(waitTime*3);
            await capture('3-' + routeToScreenshotName(route));
            await sleep(1000);

            route = `/matches/users/199325?tab=MainStats`;
            router.navigate(route);
            await sleep(waitTime*2);
            await capture('4-' + routeToScreenshotName(route));
            await sleep(1000);

            route = `/matches/users/199325?tab=MainMatches`;
            router.navigate(route);
            await sleep(waitTime*2);
            await capture('5-' + routeToScreenshotName(route));
            await sleep(1000);

            route = `/statistics/leaderboard`;
            router.navigate(route);
            await sleep(waitTime*2);
            await capture('6-' + routeToScreenshotName(route));
            await sleep(1000);

            route = `/explore/civilizations/Aztecs`;
            router.navigate(route);
            await sleep(waitTime*2);
            await capture('7-' + routeToScreenshotName(route));
            await sleep(1000);

            route = `/explore/build-orders/17?focusMode=true`;
            router.navigate(route);
            await sleep(waitTime*2);
            await capture('8-' + routeToScreenshotName(route));
            await sleep(1000);
        });
    });
}
