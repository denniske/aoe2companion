import React, { Component } from 'react';
import {ICellRendererParams} from "ag-grid-community";
import {ICellRendererComp} from "ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer";
import {getFlagIcon} from "../../helper/flags";
import {makeStyles} from "@material-ui/core/styles";
import {fade, TableCell} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";
import {getChangeColor} from "../util";

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

export default function RatingCellRenderer(props) {
    // console.log('props', props);

    const classes = useStyles();
    const { data } = props;

    if (!data) {
        return <div/>;
    }

    // console.log('render', data.name);

    return (
        <div className={classes.container}>
            <div style={{width: 100}}>{data.rating}</div>
            {/*{*/}
            {/*    data.rating - data.previous_rating > 0 &&*/}
            {/*    <FontAwesomeIcon icon={faCaretUp} color={getChangeColor(data.rating - data.previous_rating)} className={classes.icon} />*/}
            {/*}*/}
            {/*{*/}
            {/*    data.rating - data.previous_rating < 0 &&*/}
            {/*    <FontAwesomeIcon icon={faCaretDown} color={getChangeColor(data.rating - data.previous_rating)} className={classes.icon} />*/}
            {/*}*/}
            {/*<span style={{color: getChangeColor(data.rating - data.previous_rating)}}>{Math.abs(data.rating - data.previous_rating)}</span>*/}

        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: theme.spacing(0.5),
    },
}));
