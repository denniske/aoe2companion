import { registerWebModule, NativeModule } from 'expo';
import { WidgetModuleEvents } from './Widget.types';

class WidgetModule extends NativeModule<WidgetModuleEvents> {

}

export default registerWebModule(WidgetModule);
