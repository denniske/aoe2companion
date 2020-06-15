import {captureImage} from "./capture";
import {AsyncStorage} from "react-native";

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

let imageNumber = 0;

async function capture() {
  await captureImage('screen-' + imageNumber++);
}


// "rnCliPath": "./rn-cli.config.js",

export default function(spec: any) {

  spec.describe('Home', function() {

    spec.it('login', async function() {
      await AsyncStorage.removeItem('settings');

      await sleep(1000);

      await spec.exists('Search.Input');
      await spec.fillIn('Search.Input', 'baal');
      await sleep(3000);
      await capture();

      await spec.exists('Search.Player.76561197995781128-209525');
      await spec.press('Search.Player.76561197995781128-209525');
      await sleep(3000);
      await capture();

      const navigation = await spec.findComponent('Navigation');
      navigation.navigate('MainMatches');
      await sleep(3000);
      await capture();

      await spec.exists('Header.Search');
      await spec.press('Header.Search');
      await sleep(1000);

      await spec.exists('Search.Input');
      await spec.fillIn('Search.Input', 'rogge');
      await sleep(3000);

      await spec.exists('Search.Player.76561199026927891-1919951');
      await spec.press('Search.Player.76561199026927891-1919951');
      await sleep(3000);
      await capture();

      // await spec.containsText('Tab.Matches', 'asd');
      // await spec.press('Tab.Matches');
    });
  });
}