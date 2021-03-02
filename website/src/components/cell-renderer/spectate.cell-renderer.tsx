import React, { Component } from 'react';
import {ICellRendererParams} from "ag-grid-community";
import {ICellRendererComp} from "ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer";
import {getFlagIcon} from "../../helper/flags";
import {makeStyles} from "@material-ui/core/styles";
import {Button, fade} from "@material-ui/core";
import {Linking} from 'react-native';

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

export default function SpectateCellRenderer(props) {
    // console.log('props', props);

    const classes = useStyles();
    const { data } = props;

    if (!data) {
        return <div/>;
    }

    // console.log('render', data.name);

    const spectate = (event: any) => {
        window.location.href = `aoe2de://1/${data.match_id}`;
        // console.log(event);
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <div className={classes.container}>
            {/*<Button variant="contained" color="primary" size="small" onClick={() => window.location.href = `https://www.google.de`}>Spectate</Button>*/}
            <Button variant="contained" color="primary" size="small" onClick={spectate}>Spectate</Button>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 3,
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
