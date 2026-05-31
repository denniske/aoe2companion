import { registerWebModule, NativeModule } from 'expo';

class AppUpdateModule extends NativeModule<{}> {}

export default registerWebModule(AppUpdateModule, 'AppUpdateModule');
