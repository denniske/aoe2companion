import { NativeModule, requireNativeModule } from 'expo';
import { WidgetModuleEvents } from './Widget.types';

declare class WidgetModule extends NativeModule<WidgetModuleEvents> {
    getItem: (...args: string[]) => '';
    setItem: (...args: string[]) => {};
    setImage: (...args: string[]) => '';
    getImagePathIfExists: (...args: string[]) => '';
    hasImage: (...args: string[]) => boolean;
    reloadAll: () => {};
    setAppGroup: (appGroup: string) => void;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<WidgetModule>('Widget');
