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
Object.defineProperty(exports, "__esModule", { value: true });
exports.withWidgetSourceFiles = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const withWidgetSourceFiles = (config, { targetName, appGroupIdentifier, topLevelFiles, topLevelFolders }) => {
    return (0, config_plugins_1.withXcodeProject)(config, async (config) => {
        const extensionRootPath = path.join(config.modRequest.platformProjectRoot, targetName);
        const projectPath = config.modRequest.projectRoot;
        const widgetSourceDirPath = path.join(projectPath, targetName, 'ios');
        const sourceFiles = topLevelFiles.filter((file) => !file.includes('.xcassets'));
        const resourceFiles = topLevelFiles.filter((file) => file.includes('.xcassets'));
        if (!fs.existsSync(widgetSourceDirPath)) {
            await fs.promises.mkdir(widgetSourceDirPath, { recursive: true });
            const widgetStaticSourceDirPath = path.join(__dirname, 'static');
            for (const file of sourceFiles) {
                await fs.promises.copyFile(path.join(widgetStaticSourceDirPath, file), path.join(widgetSourceDirPath, file));
            }
            for (const file of resourceFiles) {
                await fs.promises.cp(path.join(widgetStaticSourceDirPath, file), path.join(widgetSourceDirPath, file), {
                    recursive: true,
                });
            }
            let allFiles = [...sourceFiles];
            for (const folder of topLevelFolders) {
                await fs.promises.cp(path.join(widgetStaticSourceDirPath, folder), path.join(widgetSourceDirPath, folder), {
                    recursive: true,
                });
                const files = fs.readdirSync(path.join(widgetSourceDirPath, folder));
                allFiles = [...allFiles, ...files.map((file) => path.join(folder, file))];
            }
            allFiles.forEach((file) => {
                const widgetSourceFilePath = path.join(widgetSourceDirPath, file // use to targetName
                );
                const content = fs.readFileSync(widgetSourceFilePath, 'utf8');
                const newContent = content.replace(/group.com.example.widget/, `${appGroupIdentifier}`);
                fs.writeFileSync(widgetSourceFilePath, newContent);
            });
        }
        await fs.promises.mkdir(extensionRootPath, { recursive: true });
        for (const file of sourceFiles) {
            await fs.promises.copyFile(path.join(widgetSourceDirPath, file), path.join(extensionRootPath, file));
        }
        for (const resourceFile of resourceFiles) {
            await fs.promises.cp(path.join(widgetSourceDirPath, resourceFile), path.join(extensionRootPath, resourceFile), {
                recursive: true,
            });
        }
        for (const folder of topLevelFolders) {
            await fs.promises.cp(path.join(widgetSourceDirPath, folder), path.join(extensionRootPath, folder), {
                recursive: true,
            });
        }
        const proj = config.modResults;
        const targetUuid = proj.findTargetKey(targetName);
        const groupUuid = proj.findPBXGroupKey({ name: targetName });
        if (!targetUuid) {
            return Promise.reject(null);
        }
        if (!groupUuid) {
            return Promise.reject(null);
        }
        for (const file of sourceFiles) {
            proj.addSourceFile(file, {
                target: targetUuid,
            }, groupUuid);
        }
        return config;
    });
};
exports.withWidgetSourceFiles = withWidgetSourceFiles;
