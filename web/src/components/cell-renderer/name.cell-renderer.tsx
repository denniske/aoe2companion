import React, { Component } from 'react';
import {ICellRendererParams} from "ag-grid-community";
import {ICellRendererComp} from "ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer";
import {getFlagIcon} from "../../helper/flags";
import {makeStyles} from "@material-ui/core/styles";
import {fade} from "@material-ui/core";

// export default class NameCellRenderer extends Component implements ICellRendererComp {
//     constructor(props) {
//         super(props);
//     }
//
//     render() {
//         return (
//             <span>
//         Field: {this.props.colDef.field}, Value: {this.props.value}
//       </span>
//         );
//     }
// }

export default function NameCellRenderer(props) {
    const classes = useStyles();
    console.log('props', props);
    const { data } = props;

    if (!data) {
        return <div/>;
    }

    return (
        <div>
            <img src={getFlagIcon(data.country)} className={classes.flagIcon}/>
            {data.name}
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    flagIcon: {
        width: 21,
        height: 15,
        marginRight: theme.spacing(1),
    },
}));
