import React, {useEffect, useState} from 'react';
import {Platform, SectionList, StyleSheet, View} from 'react-native';
import {getBuildingName, getTechName, techSections} from "@nex/data";
import {MyText} from "../components/my-text";
import {createStylesheet} from "../../theming-new";
import {Searchbar} from "react-native-paper";
import {TechCompBig} from './tech-comp';
import {getTranslation} from '../../helper/translate';
import {getCivNameById} from '../../helper/civs';


export default function TechList() {
    const styles = useStyles();
    const [text, setText] = useState('');
    const [list, setList] = useState(techSections);

    const refresh = () => {
        if (text.length == 0) {
            setList(techSections);
            return;
        }
        const newSections = techSections.map(section => ({
            ...section,
            data: section.data.filter(tech => getTechName(tech).toLowerCase().includes(text.toLowerCase())),
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
                placeholder={getTranslation('tech.search.placeholder')}
                onChangeText={text => setText(text)}
                value={text}
            />
            <SectionList
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={styles.list}
                sections={list}
                stickySectionHeadersEnabled={false}
                renderItem={({item}) => {
                    return <TechCompBig key={item} tech={item} showCivBanner={true}/>
                }}
                renderSectionHeader={({ section: { building, civ } }) => (
                    <MyText style={styles.heading}>{building ? getBuildingName(building) : getCivNameById(civ!)}</MyText>
                )}
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
