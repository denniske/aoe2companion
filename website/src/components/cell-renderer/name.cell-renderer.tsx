import React, { Component } from 'react';
import {ICellRendererParams} from "ag-grid-community";
import {ICellRendererComp} from "ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer";
import {getFlagIcon} from "../../helper/flags";
import {makeStyles} from "@material-ui/core/styles";

// export default class NameCellRenderer extends Component {
//     constructor(props) {
//         super(props);
//     }
//
//     render() {
//         console.log('render', this.props.value);
//         return (
//             <span>
//         Field: {this.props.colDef.field}, Value: {this.props.value}
//       </span>
//         );
//     }
// }

export default function NameCellRenderer(props) {
    // console.log('props', props);

    const classes = useStyles();
    const { data } = props;

    if (!data) {
        return <div/>;
    }

    // console.log('render', data.name);

    return (
        <div className={classes.container}>
            <img src={getFlagIcon(data.country)} className={classes.flagIcon}/>
            <div className={classes.name}>{data.name}</div>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        // width: 250,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    flagIcon: {
        width: 21,
        height: 15,
        marginRight: theme.spacing(1),
    },
}));
