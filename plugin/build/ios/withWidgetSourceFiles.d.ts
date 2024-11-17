import { ConfigPlugin } from '@expo/config-plugins';
interface Props {
    targetName: string;
    appGroupIdentifier: string;
    topLevelFiles: string[];
    topLevelFolders: string[];
}
export declare const withWidgetSourceFiles: ConfigPlugin<Props>;
export {};
