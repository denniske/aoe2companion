import React, {useEffect, useState} from 'react';
import {Building, buildingSections, getBuildingDescription, getBuildingName} from "@nex/data";
import {iconHeight, iconWidth} from "@nex/data";
import {createStylesheet} from "../helper/styles";
import {MyLink} from "../components/link";
import {getBuildingIcon} from "../helper/buildings";
import {FixedSizeList, ListChildComponentProps} from 'react-window';
import {flatMap} from "lodash";
import {fade, InputBase, Paper, Typography} from "@material-ui/core";
import {useAppStyles} from "../components/app-styles";


export function BuildingCompBig({building: building}: any) {
    const classes = useStyles();

    return (
        <MyLink className={classes.rowBig} key={building.toString()} href='/building/[buildingId]' as={`/building/${building}`} naked>
            {/*<div className={classes.rowBig}>*/}
                <img className={classes.unitIconBig} src={getBuildingIcon(building)}/>
                <div className={classes.unitIconBigTitle}>
                    <div>{getBuildingName(building)}</div>
                    {/*<div className={classes.small}>{getBuildingDescription(building)}</div>*/}
                    <Typography noWrap className={classes.small}>{getBuildingDescription(building)}</Typography>
                </div>
             {/*</div>*/}
        </MyLink>
    );
}

function makeList(sections: any) {
    return flatMap(sections, section => {
        return [
            {
                type: 'section',
                title: section.title,
            },
            ...section.data.map(data => ({
                type: 'item',
                item: data,
            })),
        ]
    })
}

export default function BuildingView() {
    const appClasses = useAppStyles();
    const classes = useStyles();
    const [text, setText] = useState('');
    const [list, setList] = useState(makeList(buildingSections));

    const refresh = () => {
        if (text.length == 0) {
            setList(makeList(buildingSections));
            return;
        }
        const newSections = buildingSections.map(section => ({
            ...section,
            data: section.data.filter(building => getBuildingName(building).toLowerCase().includes(text.toLowerCase())),
        })).filter(section => section.data.length > 0);
        setList(makeList(newSections));
    };

    useEffect(() => {
        refresh();
    }, [text]);

    // function renderRow(props: ListChildComponentProps) {
    //     const { data, index, style } = props;
    //     return React.cloneElement(data[index], {
    //         style: {
    //             ...style,
    //             top: (style.top as number) + LISTBOX_PADDING,
    //         },
    //     });
    // }

    return (
        <Paper className={appClasses.boxForTable}>
            <div className={classes.searchRow}>
                {/*<div className={classes.searchIcon}>*/}
                {/*  <SearchIcon/>*/}
                {/*</div>*/}
                <InputBase
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Search by name…"
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{'aria-label': 'search'}}
                />
            </div>
            {/*<Searchbar*/}
            {/*    className={classes.searchbar}*/}
            {/*    placeholder="building"*/}
            {/*    onChangeText={text => setText(text)}*/}
            {/*    value={text}*/}
            {/*/>*/}

            <div className={classes.maxHeight}>
                <div className={classes.maxHeightInner}>
                    {
                        list.map(item => {
                            if (item.type == 'section')
                                return <div key={item.title} className={classes.heading}>{item.title}</div>;
                            if (item.type == 'item')
                                return <BuildingCompBig key={item.item} building={item.item} showCivBanner={true}/>;
                        })
                    }
                </div>
            </div>

            {/*<FixedSizeList*/}
            {/*    width="100%"*/}
            {/*    height={400}*/}
            {/*    itemCount={20}*/}
            {/*    itemSize={50}*/}
            {/*    itemData={list}*/}
            {/*>*/}
            {/*    {({ data, index, style }) => {*/}
            {/*        const item = data[index];*/}
            {/*        // console.log('item', item);*/}
            {/*        // return <div>{index}</div>;*/}
            {/*        // if (item.type == 'section')*/}
            {/*        //     return <div>{item.title}</div>;*/}
            {/*        if (item.type == 'item')*/}
            {/*            return <BuildingCompBig style={style} key={item.item} building={item.item} showCivBanner={true}/>;*/}
            {/*        // return <div style={style}>{item.type} {index}</div>;*/}
            {/*    }}*/}
            {/*</FixedSizeList>*/}

        </Paper>
    );
}


const useStyles = createStylesheet((theme) => ({
    maxHeight: {
        flex: 1,
        // height: 700,
        overflow: 'auto',
    },
    maxHeightInner: {
        padding: theme.spacing(2, 3, 3, 3),
    },

    searchRow: {
        borderRadius: 0,
        display: 'flex',
        alignItems: 'center',
        // margin: theme.spacing(0, -3, 2, -3),
        // marginTop: -theme.spacing(3),
        marginBottom: 0,
        backgroundColor: fade(theme.palette.common.black, 0.00),
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.1), 0px 1px 1px 0px rgba(0,0,0,0.07), 0px 1px 3px 0px rgba(0,0,0,0.06)',
    },
    searchIcon: {
        padding: theme.spacing(0, 2, 0, 2),
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        // backgroundColor: 'yellow',
        flex: 1,
    },
    inputInput: {
        padding: theme.spacing(2, 3, 2, 3),
        display: 'flex',
        // flex: 1,
        // backgroundColor: 'pink',
        // paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        // width: '100%',
    },

    container: {
        flex: 1,
    },
    list: {
        padding: 20,
    },

    searchbar: {
        marginTop: 0,
        borderRadius: 0,
        paddingHorizontal: 10,
    },

    row: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
        // backgroundColor: 'blue',
    },
    unitIcon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    unitIconTitle: {
        flex: 1,
        // backgroundColor: 'red',
    },

    rowBig: {
        display: "flex",
        flexDirection: "row",
        // flexDirection: 'row',
        // alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        flex: 1,
        // height: 50,
        // backgroundColor: 'blue',
    },
    unitIconBig: {
        width: iconWidth,
        height: iconHeight,
    },
    unitIconBigBanner: {
        position: 'absolute',
        width: iconWidth/2.0,
        height: iconHeight/2.0,
        left: iconWidth/2.0,
        bottom: -1,
    },
    unitIconBigTitle: {
        display: 'flex',
        flexDirection: "column",
        flex: 1,
        paddingLeft: 8,
        minWidth: 0,
        // backgroundColor: 'red',
    },
    small: {
        fontSize: 12,
        color: '#333',
    },

    heading: {
        paddingVertical: 12,
        marginBottom: 5,
        fontWeight: 'bold',
    },
}));
