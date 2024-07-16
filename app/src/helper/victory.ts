import tw from '@app/tailwind';
import { cloneDeep, merge } from 'lodash';
import { VictoryTheme } from 'victory-native';

export { VictoryAxis, VictoryChart, VictoryLine, VictoryScatter, VictoryBar, VictoryArea, LineSegment } from 'victory-native';

function replaceRobotoWithSystemFont(obj: any) {
    const keys = Object.keys(obj);
    keys.forEach(function (key) {
        const value = obj[key];
        if (key === 'fontFamily') {
            obj[key] = obj[key].replace("'Roboto',", "'System',");
        }
        if (typeof value === 'object') {
            replaceRobotoWithSystemFont(obj[key]);
        }
    });
    return obj;
}

let themeWithSystemFont = replaceRobotoWithSystemFont(cloneDeep(VictoryTheme.material));

themeWithSystemFont = merge(themeWithSystemFont, {
    axis: {
        style: {
            tickLabels: {
                fill: tw.color('text-black'),
            },
        },
    },
    line: {
        style: {
            labels: {
                fill: tw.color('text-black'),
            },
        },
    },
});

let themeWithSystemFontDark = replaceRobotoWithSystemFont(cloneDeep(VictoryTheme.material));

themeWithSystemFontDark = merge(themeWithSystemFontDark, {
    axis: {
        style: {
            tickLabels: {
                fill: tw.color('text-white'),
            },
        },
    },
    line: {
        style: {
            labels: {
                fill: tw.color('text-white'),
            },
        },
    },
});

const Theme = { ...VictoryTheme, custom: themeWithSystemFont, customDark: themeWithSystemFontDark };

export { Theme as VictoryTheme };
