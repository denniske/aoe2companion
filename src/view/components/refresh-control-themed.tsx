import {RefreshControl, RefreshControlProps} from "react-native";
import React from "react";
import { useAppTheme } from '../../theming';


export default function RefreshControlThemed(props: RefreshControlProps) {
    const theme = useAppTheme();
    return <RefreshControl
        tintColor={theme.textColor}
        titleColor={theme.textColor}
        {...props}
    />
}
