import { ConfigPlugin, withXcodeProject } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

interface Props {
    targetName: string;
    appGroupIdentifier: string;
}

export const withWidgetSourceFiles: ConfigPlugin<Props> = (config, { targetName, appGroupIdentifier }) => {
    return withXcodeProject(config, async (config) => {
        const extensionRootPath = path.join(config.modRequest.platformProjectRoot, targetName);
        const projectPath = config.modRequest.projectRoot;
        const widgetSourceDirPath = path.join(projectPath, targetName, 'ios');
        if (!fs.existsSync(widgetSourceDirPath)) {
            await fs.promises.mkdir(widgetSourceDirPath, { recursive: true });
            const widgetStaticSourceDirPath = path.join(__dirname, 'static');
            await fs.promises.copyFile(
                path.join(widgetStaticSourceDirPath, 'WidgetBundle.swift'),
                path.join(widgetSourceDirPath, 'WidgetBundle.swift')
            );
            await fs.promises.cp(path.join(widgetStaticSourceDirPath, 'Assets.xcassets'), path.join(widgetSourceDirPath, 'Assets.xcassets'), {
                recursive: true,
            });
            await fs.promises.cp(path.join(widgetStaticSourceDirPath, 'Widgets'), path.join(widgetSourceDirPath, 'Widgets'), {
                recursive: true,
            });
            const files = fs.readdirSync(path.join(widgetSourceDirPath, 'Widgets'));

            ['WidgetBundle.swift', ...files.map((file) => path.join('Widgets', file))].forEach((file) => {
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
        await fs.promises.copyFile(path.join(widgetSourceDirPath, 'WidgetBundle.swift'), path.join(extensionRootPath, 'WidgetBundle.swift'));
        await fs.promises.cp(path.join(widgetSourceDirPath, 'Assets.xcassets'), path.join(extensionRootPath, 'Assets.xcassets'), { recursive: true });
        await fs.promises.cp(path.join(widgetSourceDirPath, 'Widgets'), path.join(extensionRootPath, 'Widgets'), { recursive: true });

        const proj = config.modResults;
        const targetUuid = proj.findTargetKey(targetName);
        const groupUuid = proj.findPBXGroupKey({ name: targetName });

        if (!targetUuid) {
            return Promise.reject(null);
        }
        if (!groupUuid) {
            return Promise.reject(null);
        }

        proj.addSourceFile(
            'WidgetBundle.swift',
            {
                target: targetUuid,
            },
            groupUuid
        );

        return config;
    });
};
