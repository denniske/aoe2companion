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

const waitTime = 6000;

export default function(spec: any) {

  spec.describe('Home', function() {

    spec.it('login', async function() {
      await AsyncStorage.removeItem('settings');

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

      const navigation = await spec.findComponent('Navigation');
      navigation.navigate('MainMatches');
      await sleep(waitTime);
      await capture();

      await spec.exists('Header.Search');
      await spec.press('Header.Search');
      await sleep(1000);

      await spec.exists('Search.Input');
      await spec.fillIn('Search.Input', 'baratticus');
      await sleep(waitTime);

      await spec.exists('Search.Player.76561198116899512-336655');
      await spec.press('Search.Player.76561198116899512-336655');
      await sleep(waitTime);
      await capture();
    });
  });
}