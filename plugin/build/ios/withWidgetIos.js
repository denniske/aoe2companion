"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withWidgetIos = void 0;
const withWidgetEntitlements_1 = require("./withWidgetEntitlements");
const withWidgetSourceFiles_1 = require("./withWidgetSourceFiles");
const withWidgetPlist_1 = require("./withWidgetPlist");
const withWidgetXcodeTarget_1 = require("./withWidgetXcodeTarget");
const withWidgetIos = (config, { widgetName, ios }) => {
    const { appGroupIdentifier, devTeamId } = ios;
    const targetName = widgetName;
    const topLevelFiles = ios.topLevelFiles;
    const topLevelFolders = ios.topLevelFolders;
    config = (0, withWidgetEntitlements_1.withWidgetEntitlements)(config, { targetName, appGroupIdentifier });
    config = (0, withWidgetSourceFiles_1.withWidgetSourceFiles)(config, { targetName, appGroupIdentifier, topLevelFiles, topLevelFolders });
    config = (0, withWidgetPlist_1.withWidgetPlist)(config, { targetName });
    config = (0, withWidgetXcodeTarget_1.withWidgetXcodeTarget)(config, {
        devTeamId,
        targetName,
        topLevelFiles,
        topLevelFolders,
    });
    return config;
};
exports.withWidgetIos = withWidgetIos;
