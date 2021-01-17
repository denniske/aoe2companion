import {captureImage} from "./capture";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList, RootTabParamList} from "../../App";
import {MaterialTopTabNavigationProp} from "@react-navigation/material-top-tabs";

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

let imageNumber = 0;

async function capture() {
    // console.log('CAPTURE');
    // await captureImage('screen-' + imageNumber++);
}

const waitTime = 6000;

export default function (spec: any) {

    spec.describe('App', function () {

        spec.it('all', async function () {
            await AsyncStorage.removeItem('settings');
            await AsyncStorage.setItem('following', '[{"id":"76561197984749679-196240","steam_id":"76561197984749679","profile_id":196240,"name":"TheViper","games":1187,"country":"DE"},{"id":"76561198275970890-196310","steam_id":"76561198275970890","profile_id":196310,"name":"F1Re","games":1309,"country":"BR"},{"id":"76561198044559189-198035","steam_id":"76561198044559189","profile_id":198035,"name":"_DauT_","games":1378,"country":"RS"},{"id":"76561198449406083-199325","steam_id":"76561198449406083","profile_id":199325,"name":"[aM] Hera","games":1827,"country":"CA"},{"id":"76561197996386232-251265","steam_id":"76561197996386232","profile_id":251265,"name":"[aM] MbL40C","games":1809,"country":"NO"}]');

            await sleep(1000);

            const navigation = await spec.findComponent('Navigation') as StackNavigationProp<RootStackParamList, "Main">;
            const tabNavigation = await spec.findComponent('Navigation') as MaterialTopTabNavigationProp<RootTabParamList, "MainProfile">;

            // navigation.reset({index: 0, routes: [{name: 'Feed'}]});
            await sleep(waitTime*2);
            await capture();
            await sleep(1000);

            navigation.reset({index: 0, routes: [{name: 'Main'}]});
            await sleep(1000);

            await spec.exists('Search.Input');
            await spec.fillIn('Search.Input', 'baal');
            await sleep(waitTime);
            await capture();
            await sleep(1000);

            await spec.exists('Search.Player.76561197995781128-209525');
            await spec.press('Search.Player.76561197995781128-209525');
            await sleep(waitTime);
            await capture();

            // tabNavigation.navigate('MainMatches');
            // await sleep(waitTime);
            // await capture();

            navigation.navigate('Search', {});
            await sleep(1000);

            await spec.exists('Search.Input');
            await spec.fillIn('Search.Input', 'baratticus');
            await sleep(waitTime);

            await spec.exists('Search.Player.76561198116899512-336655');
            await spec.press('Search.Player.76561198116899512-336655');
            await sleep(waitTime);
            await capture();

            navigation.reset({index: 0, routes: [{name: 'Leaderboard'}]});
            await sleep(1000);
            await sleep(waitTime);
            await capture();

            navigation.reset({index: 0, routes: [{name: 'Guide'}]});
            await sleep(1000);
            await sleep(waitTime);
            await capture();

            navigation.reset({index: 0, routes: [{name: 'Civ'}]})
            await sleep(1000);
            await sleep(waitTime);
            await capture();

            navigation.reset({index: 0, routes: [{name: 'Civ'}, {name: 'Civ', params: {civ: 'Aztecs'}}]})
            await sleep(1000);
            await sleep(waitTime);
            await capture();

            navigation.reset({index: 0, routes: [{name: 'Unit'}, {name: 'Unit', params: {unit: 'Arambai'}}]})
            await sleep(1000);
            await sleep(waitTime);
            await capture();
        });
    });
}
