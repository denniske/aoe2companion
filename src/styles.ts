import {StyleSheet} from "react-native";
import {ITheme, makeVariants} from "./theming";


// export const linkColor = '#397AF9';
// export const linkColor = '#3498db';
// export const linkColor = 'rgb(10, 132, 255)';


const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        link: {
            color: theme.linkColor,
        },
        expanded: {
            flex: 1,
        },
    });

};

export const appVariants = makeVariants(getStyles);
