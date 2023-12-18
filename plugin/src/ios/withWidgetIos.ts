import { ConfigPlugin } from '@expo/config-plugins';
import { withWidgetEntitlements } from './withWidgetEntitlements';
import { withWidgetSourceFiles } from './withWidgetSourceFiles';
import { withWidgetPlist } from './withWidgetPlist';
import { withWidgetXcodeTarget } from './withWidgetXcodeTarget';
import { Props } from '..';

export const withWidgetIos: ConfigPlugin<Props> = (config, { widgetName, ios }) => {
    const { appGroupIdentifier, devTeamId } = ios;
    const targetName = widgetName;
    const topLevelFiles = ios.topLevelFiles;
    const topLevelFolders = ios.topLevelFolders;

    config = withWidgetEntitlements(config, { targetName, appGroupIdentifier });
    config = withWidgetSourceFiles(config, { targetName, appGroupIdentifier, topLevelFiles, topLevelFolders });
    config = withWidgetPlist(config, { targetName });
    config = withWidgetXcodeTarget(config, {
        devTeamId,
        targetName,
        topLevelFiles,
        topLevelFolders,
    });
    return config;
};
