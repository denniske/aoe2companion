import {RefreshControl, RefreshControlProps} from "react-native";
import React from "react";
import {usePaperTheme} from "../../theming";


export default function RefreshControlThemed(props: RefreshControlProps) {
    const paperTheme = usePaperTheme();
    return <RefreshControl
        tintColor={paperTheme.colors.text}
        titleColor={paperTheme.colors.text}
        {...props}
    />
}
