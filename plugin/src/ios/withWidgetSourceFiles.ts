import { ConfigPlugin, withXcodeProject } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

interface Props {
    targetName: string;
    appGroupIdentifier: string;
    topLevelFiles: string[];
    topLevelFolders: string[];
}

export const withWidgetSourceFiles: ConfigPlugin<Props> = (config, { targetName, appGroupIdentifier, topLevelFiles, topLevelFolders }) => {
    return withXcodeProject(config, async (config) => {
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
                const widgetSourceFilePath = path.join(
                    widgetSourceDirPath,
                    file // use to targetName
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
            proj.addSourceFile(
                file,
                {
                    target: targetUuid,
                },
                groupUuid
            );
        }

        return config;
    });
};
