import {captureImage} from "../src/ci/capture";

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default function(spec) {

  spec.describe('Home', function() {

    spec.it('login', async function() {
      await sleep(1000);
      await spec.exists('Scene.TextInput');
      await spec.fillIn('Scene.TextInput', 'baal');
      await captureImage();
      // await spec.fillIn('LoginScreen.PasswordInput', 'password');
      // await spec.press('LoginScreen.Button');
      // await spec.exists('WelcomeScreen');
    });
  });
}