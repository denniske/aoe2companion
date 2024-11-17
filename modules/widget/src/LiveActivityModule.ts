import { NativeModule, requireNativeModule } from 'expo';
import { LiveActivityModuleEvents } from './LiveActivity.types';

declare class LiveActivityModule extends NativeModule<LiveActivityModuleEvents> {
    enable(): void;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<LiveActivityModule>('LiveActivity');
