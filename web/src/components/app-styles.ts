import {makeStyles} from "@material-ui/core/styles";

export const useAppStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    expanded: {
        flex: 1,
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    box: {
        // minHeight: 200,
        overflow: 'hidden',
        maxWidth: 800,
        padding: theme.spacing(3),
        marginBottom: theme.spacing(3),
        // marginRight: theme.spacing(3),
    },
    boxSmall: {
        maxWidth: 800,
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        marginBottom: theme.spacing(3),
        // marginRight: theme.spacing(3),
    },
    boxForTable: {
        maxWidth: 800,
        marginBottom: theme.spacing(3),
        // marginRight: theme.spacing(3),
    },
}));
