import React, {useEffect, useState} from 'react';
import {allUnitSections, getUnitName, makeListFromSections, Unit} from "@nex/data";
import {UnitCompBig} from '../components/unit-comp';
import {Paper} from '@material-ui/core';
import SearchBar from '../components/search-bar';
import ScrollContainer from '../components/scroll-container';
import {useAppStyles} from '../components/app-styles';
import {createStylesheet} from '../helper/styles';
import {View, StyleSheet} from '../components/compat';


export default function UnitView() {
    const styles = useStyles();
    const appClasses = useAppStyles();
    const [text, setText] = useState('');
    const [list, setList] = useState(makeListFromSections(allUnitSections));

    const refresh = () => {
        const newSections = allUnitSections.map(section => ({
            ...section,
            data: section.data
                .filter(u => {
                    // if (unitLines[u]) {
                    //     return unitLines[u].units.some(u => getUnitName(u).toLowerCase().includes(text.toLowerCase()));
                    // }
                    return getUnitName(u).toLowerCase().includes(text.toLowerCase());
                }
            ),
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
                            return <UnitCompBig key={item.data} unit={item.data as Unit}/>;
                    })
                }
            </ScrollContainer>
        </Paper>
    );
}

const useStyles = createStylesheet(theme => ({
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
    heading: {
        paddingVertical: 12,
        marginBottom: 5,
        fontWeight: 'bold',
        // backgroundColor: theme.backgroundColor,
    },
}));
