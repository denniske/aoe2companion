import React, {useEffect, useState} from 'react';
import {getTechName, iconHeight, iconWidth, makeListFromSections, Tech, techSections} from "@nex/data";
import {View} from "../components/compat";
import {createStylesheet} from '../helper/styles';
import {Paper} from '@material-ui/core';
import SearchBar from '../components/search-bar';
import ScrollContainer from '../components/scroll-container';
import {useAppStyles} from '../components/app-styles';
import {TechCompBig} from './civilization/[civId]';


export default function TechView() {
    const styles = useStyles();
    const appClasses = useAppStyles();
    const [text, setText] = useState('');
    const [list, setList] = useState(makeListFromSections(techSections));

    const refresh = () => {
        if (text.length == 0) {
            setList(makeListFromSections(techSections));
            return;
        }
        const newSections = techSections.map(section => ({
            ...section,
            data: section.data.filter(tech => getTechName(tech).toLowerCase().includes(text.toLowerCase())),
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
                            return <View key={'section-'+item.data} style={styles.heading}>{item.data}</View>;
                        if (item.type == 'item')
                            return <TechCompBig key={item.data} tech={item.data} showCivBanner={true}/>;
                    })
                }
            </ScrollContainer>
        </Paper>
    );
}


const useStyles = createStylesheet((theme) => ({
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
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
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
        bottom: -1,//iconHeight/2.0,
    },
    unitIconBigTitle: {
        flex: 1,
        paddingLeft: 8,
        minWidth: 0,
        // backgroundColor: 'red',
    },
    small: {
        fontSize: 12,
        color: theme.textNoteColor,
    },

    heading: {
        paddingVertical: 12,
        marginBottom: 5,
        fontWeight: 'bold',
        // backgroundColor: theme.backgroundColor,
    },
}));
