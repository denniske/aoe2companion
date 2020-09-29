import React, {useEffect, useState} from 'react';
import {
    buildingSections, getBuildingDescription, getBuildingName, iconHeight, iconWidth, makeListFromSections
} from "@nex/data";
import {createStylesheet} from "../helper/styles";
import {MyLink} from "../components/link";
import {getBuildingIcon} from "../helper/buildings";
import {Paper, Typography} from "@material-ui/core";
import {useAppStyles} from "../components/app-styles";
import SearchBar from "../components/search-bar";
import ScrollContainer from "../components/scroll-container";


export function BuildingCompBig({building: building}: any) {
    const classes = useStyles();

    return (
        <MyLink className={classes.rowBig} href='/building/[buildingId]' as={`/building/${building}`} naked>
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

export default function BuildingView() {
    const appClasses = useAppStyles();
    const classes = useStyles();
    const [text, setText] = useState('');
    const [list, setList] = useState(makeListFromSections(buildingSections));

    const refresh = () => {
        if (text.length == 0) {
            setList(makeListFromSections(buildingSections));
            return;
        }
        const newSections = buildingSections.map(section => ({
            ...section,
            data: section.data.filter(building => getBuildingName(building).toLowerCase().includes(text.toLowerCase())),
        })).filter(section => section.data.length > 0);
        setList(makeListFromSections(newSections));
    };

    useEffect(() => {
        refresh();
    }, [text]);

    return (
        <Paper className={appClasses.boxForTable}>
            <SearchBar search={text} onChangeSearch={setText}/>
            <ScrollContainer>
                {
                    list.map(item => {
                        if (item.type == 'section')
                            return <div key={item.title} className={classes.heading}>{item.title}</div>;
                        if (item.type == 'item')
                            return <BuildingCompBig key={item.data} building={item.data} showCivBanner={true}/>;
                    })
                }
            </ScrollContainer>
        </Paper>
    );
}


const useStyles = createStylesheet((theme) => ({
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


// function renderRow(props: ListChildComponentProps) {
//     const { data, index, style } = props;
//     return React.cloneElement(data[index], {
//         style: {
//             ...style,
//             top: (style.top as number) + LISTBOX_PADDING,
//         },
//     });
// }

// {/*<FixedSizeList*/}
// {/*    width="100%"*/}
// {/*    height={400}*/}
// {/*    itemCount={20}*/}
// {/*    itemSize={50}*/}
// {/*    itemData={list}*/}
// {/*>*/}
// {/*    {({ data, index, style }) => {*/}
// {/*        const item = data[index];*/}
// {/*        // console.log('item', item);*/}
// {/*        // return <div>{index}</div>;*/}
// {/*        // if (item.type == 'section')*/}
// {/*        //     return <div>{item.title}</div>;*/}
// {/*        if (item.type == 'item')*/}
// {/*            return <BuildingCompBig style={style} key={item.item} building={item.item} showCivBanner={true}/>;*/}
// {/*        // return <div style={style}>{item.type} {index}</div>;*/}
// {/*    }}*/}
// {/*</FixedSizeList>*/}
