"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withWidgetEntitlements = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const plist_1 = __importDefault(require("@expo/plist"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const withWidgetEntitlements = (config, { appGroupIdentifier, targetName }) => {
    return (0, config_plugins_1.withXcodeProject)(config, async (config) => {
        const entitlementsFilename = `${targetName}.entitlements`;
        const extensionRootPath = path.join(config.modRequest.platformProjectRoot, targetName);
        const entitlementsPath = path.join(extensionRootPath, entitlementsFilename);
        const extensionEntitlements = {
            "com.apple.security.application-groups": [appGroupIdentifier],
        };
        // create file
        await fs.promises.mkdir(path.dirname(entitlementsPath), {
            recursive: true,
        });
        await fs.promises.writeFile(entitlementsPath, plist_1.default.build(extensionEntitlements));
        // add file to extension group
        const proj = config.modResults;
        const targetUuid = proj.findTargetKey(targetName);
        const groupUuid = proj.findPBXGroupKey({ name: targetName });
        proj.addFile(entitlementsFilename, groupUuid, {
            target: targetUuid,
            lastKnownFileType: "text.plist.entitlements",
        });
        // update build properties
        proj.updateBuildProperty("CODE_SIGN_ENTITLEMENTS", `${targetName}/${entitlementsFilename}`, null, targetName);
        return config;
    });
};
exports.withWidgetEntitlements = withWidgetEntitlements;
