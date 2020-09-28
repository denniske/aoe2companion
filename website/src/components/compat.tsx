import {createStylesheet} from "../helper/styles";
import {MyLink} from "./link";
import React from "react";

export const StyleSheet = {
    create: createStylesheet,
}

export function Image(props) {
    const { children, style, source, fadeDuration, ...rest } = props;
    return <img className={style} src={source} {...rest}>{children}</img>;
}

export function View(props) {
    const { children, style, ...rest } = props;
    return <div className={style} {...rest}>{children}</div>;
}

export function MyText(props) {
    const { children, style, ...rest } = props;
    return <div className={style} {...rest}>{children}</div>;
}

export function TouchableOpacity(props) {
    const { children, style, ...rest } = props;

    return (
        <MyLink className={style} {...rest}>
            {children}
        </MyLink>
    );
}
