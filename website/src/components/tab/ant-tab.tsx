import {createStyles, Tab, Theme, withStyles} from "@material-ui/core";
import React from "react";

export const AntTab = withStyles((theme: Theme) =>
    createStyles({
        root: {
            minWidth: 100,
        },
    }),
)((props: any) => <Tab {...props} />);
