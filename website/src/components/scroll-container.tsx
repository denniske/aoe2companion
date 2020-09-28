import React from "react";
import {createStylesheet} from "../helper/styles";

interface Props {
    children: React.ReactNode;
}

export default function ScrollContainer(props: Props) {
    const { children } = props;
    const classes = useStyles();

    return (
        <div className={classes.maxHeight}>
            <div className={classes.maxHeightInner}>
                {children}
            </div>
        </div>
    );
}

const useStyles = createStylesheet((theme) => ({
    maxHeight: {
        flex: 1,
        overflow: 'auto',
    },
    maxHeightInner: {
        padding: theme.spacing(2, 3, 3, 3),
    },
}));
