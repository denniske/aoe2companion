import React, {useEffect, useState} from 'react';
import {Platform, SectionList, StyleSheet, View} from 'react-native';
import {buildingSections, getBuildingName} from "@nex/data";
import {MyText} from "../components/my-text";
import {createStylesheet} from "../../theming-new";
import {Searchbar} from "react-native-paper";
import {BuildingCompBig} from './building-comp';
import {getTranslation} from '../../helper/translate';


export default function BuildingList() {
    const styles = useStyles();
    const [text, setText] = useState('');
    const [list, setList] = useState(buildingSections);

    const refresh = () => {
        if (text.length == 0) {
            setList(buildingSections);
            return;
        }
        const newSections = buildingSections.map(section => ({
            ...section,
            data: section.data.filter(building => getBuildingName(building).toLowerCase().includes(text.toLowerCase())),
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
                placeholder={getTranslation('building.search.placeholder')}
                onChangeText={text => setText(text)}
                value={text}
            />
            <SectionList
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={styles.list}
                sections={list}
                stickySectionHeadersEnabled={false}
                renderItem={({item}) => {
                    return <BuildingCompBig key={item} building={item} showCivBanner={true}/>
                }}
                renderSectionHeader={({ section: { title } }) => (
                    <MyText style={styles.heading}>{getTranslation(title)}</MyText>
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
    },
}));
