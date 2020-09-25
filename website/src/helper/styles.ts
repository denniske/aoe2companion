import * as CSS from 'csstype';
import {Property} from "csstype";
import {makeStyles} from "@material-ui/core/styles";

interface StandardCSSProperties extends CSS.Properties<number | string> {}

interface CustomCSSProperties extends CSS.Properties<number | string> {
    'marginVertical'?: Property.MarginBottom<number | string>;
}

type CustomCssStyles = Record<string, StandardCSSProperties>;

type NamedStyles<T> = { [P in keyof T]: CustomCSSProperties };
type NamedClasses<T> = { [P in keyof T]: string };

type StyleFromProp<T> = (props?: any) => NamedClasses<T>;

export function createStylesheet<T extends NamedStyles<T>>(styles: T): StyleFromProp<T> {

    for (const className in styles) {
        const props = Object.keys(styles[className]);
        if (props.includes('marginVertical')) {
            styles[className].marginTop = styles[className]['marginVertical'];
            styles[className].marginBottom = styles[className]['marginVertical'];
            delete styles[className].marginVertical;
        }
    }

    console.log(styles);

    const mystyles = styles as any;
    return makeStyles(theme => mystyles) as any as StyleFromProp<T>;
}
