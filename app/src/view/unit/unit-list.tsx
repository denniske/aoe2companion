import React, {useEffect, useState} from 'react';
import {Platform, SectionList, StyleSheet, Text, View} from 'react-native';
import {allUnitSections, getUnitName} from "@nex/data";
import {Searchbar} from "react-native-paper";
import {createStylesheet} from '../../theming-new';
import {UnitCompBig} from './unit-comp';
import {MyText} from '../components/my-text';


export default function UnitList() {
    const styles = useStyles();
    const [text, setText] = useState('');
    const [list, setList] = useState(allUnitSections);

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
        setList(newSections);
    };

    useEffect(() => {
        refresh();
    }, [text]);

    return (
        <View style={styles.container}>
            <Searchbar
                style={styles.searchbar}
                placeholder="unit"
                onChangeText={text => setText(text)}
                value={text}
            />
            <SectionList
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={styles.list}
                sections={list}
                stickySectionHeadersEnabled={false}
                renderItem={({item}) => {
                    // if (unitLines[item] && text.length === 0) {
                    //     return <UnitLineCompBig key={item} unitLine={item}/>
                    // }
                    return <UnitCompBig key={item} unit={item}/>
                }}
                renderSectionHeader={({ section: { title } }) => {
                    // if (civ) {
                    //     return (
                    //         <View style={styles.row}>
                    //             {/*<Image fadeDuration={0} source={getCivIcon(civ)} style={styles.unitIcon}/>*/}
                    //             <Text style={styles.heading}>{title}</Text>
                    //         </View>
                    //     );
                    // }
                    return (
                        <MyText style={styles.heading}>{title}</MyText>
                    );
                }}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

const useStyles = createStylesheet((theme, mode) => StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        padding: 20,
    },
    searchbar: {
        marginTop: Platform.select({ ios: mode == 'light' ? 5 : 0 }),
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
