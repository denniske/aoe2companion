import { ConfigPlugin, withAppBuildGradle } from "@expo/config-plugins";

/**
 * Add "apply plugin: kotlin-android" to app build.gradle
 * @param config
 * @returns
 */
export const withWidgetAppBuildGradle: ConfigPlugin = (config) => {
  return withAppBuildGradle(config, async (newConfig) => {
    const buildGradle = newConfig.modResults.contents;
    const search = /(apply plugin: "com\.android\.application"\n)/gm;
    const replace = `$1apply plugin: "kotlin-android"\n`;
    let newBuildGradle = buildGradle.replace(search, replace);

    newBuildGradle = newBuildGradle.replace(
      /dependencies\s?{/,
      `dependencies {
    implementation 'com.google.code.gson:gson:2.10.1'`
    );

    newConfig.modResults.contents = newBuildGradle;
    return newConfig;
  });
};
