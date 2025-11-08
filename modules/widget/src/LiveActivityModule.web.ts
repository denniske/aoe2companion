import { NativeModule, registerWebModule } from 'expo';
import { LiveActivityModuleEvents } from './LiveActivity.types';

class LiveActivityModule extends NativeModule<LiveActivityModuleEvents> {

}

export default registerWebModule(LiveActivityModule, 'LiveActivityModule');
