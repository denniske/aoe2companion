import {captureImage} from "./capture";
import {AsyncStorage} from "react-native";
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
    // await captureImage('screen-' + imageNumber++);
}

const waitTime = 6000;

export default function (spec: any) {

    spec.describe('Home', function () {

        spec.it('login', async function () {
            await AsyncStorage.removeItem('settings');

            await sleep(1000);

            const navigation = await spec.findComponent('Navigation') as StackNavigationProp<RootStackParamList, "Main">;
            const tabNavigation = await spec.findComponent('Navigation') as MaterialTopTabNavigationProp<RootTabParamList, "MainHome">;

            await spec.exists('Search.Input');
            await spec.fillIn('Search.Input', 'baal');
            await sleep(waitTime);
            await capture();
            await sleep(1000);

            await spec.exists('Search.Player.76561197995781128-209525');
            await spec.press('Search.Player.76561197995781128-209525');
            await sleep(waitTime);
            await capture();

            tabNavigation.navigate('MainMatches');
            await sleep(waitTime);
            await capture();

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
        });
    });
}