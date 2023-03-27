import React, {useEffect, useState} from 'react';
import {FlatList, Image, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {
    aoeCivKey,
    Civ,
    civDict,
    civs,
    getCivNameById,
    getCivTeamBonus,
    iconHeight,
    iconWidth,
    orderCivs,
    parseCivDescription
} from "@nex/data";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {RootStackParamList, RootStackProp} from "../../App";
import IconHeader from "./components/navigation-header/icon-header";
import TextHeader from "./components/navigation-header/text-header";
import {TechTree} from "./components/tech-tree";
import {MyText} from "./components/my-text";
import {createStylesheet} from "../theming-new";
import {HighlightUnitAndTechs} from "../helper/highlight";
import {getCivHistoryImage, getCivIcon} from "../helper/civs";
import {UnitCompBig} from './unit/unit-comp';
import {TechCompBig} from './tech/tech-comp';
import {getTranslation} from '../helper/translate';
import {appConfig} from "@nex/dataset";
import {Searchbar} from 'react-native-paper';


export function CivTitle(props: any) {
    if (props.route?.params?.civ) {
        return <IconHeader
            icon={getCivIcon(props.route?.params?.civ)}
            text={getCivNameById(props.route.params?.civ)}
            onLayout={props.titleProps.onLayout}
        />;
    }
    return <TextHeader text={getTranslation('civs.title')} onLayout={props.titleProps.onLayout}/>;
}

export function civTitle(props: any) {
    return props.route?.params?.civ || getTranslation('civs.title');
}

export function CivDetails({civ}: {civ: aoeCivKey}) {
    const styles = useStyles();
    const civDescription = parseCivDescription(civ);

    if (civDescription == null) {
        return <View/>;
    }

    const {type, boni, uniqueUnitsTitle, uniqueTechsTitle, teamBonusTitle, teamBonus} = civDescription;

    return (
        <View style={styles.detailsContainer}>
            <MyText style={styles.content}>{type}</MyText>

            <View style={styles.box}>
                <MyText style={styles.heading}>Bonus</MyText>
                {
                    boni.map((bonus, i) =>
                        <View key={i} style={styles.bonusRow}>
                            <MyText style={styles.bullet}>• </MyText>
                            <MyText style={styles.content}><HighlightUnitAndTechs str={bonus}/></MyText>
                        </View>
                    )
                }
            </View>

            <View style={styles.box}>
                <MyText style={styles.heading}>{uniqueUnitsTitle.replace(':', '')}</MyText>
                {
                    civDict[civ].uniqueUnits.map(unit =>
                        <UnitCompBig key={unit} unit={unit}/>
                    )
                }
            </View>

            <View style={styles.box}>
                <MyText style={styles.heading}>{uniqueTechsTitle.replace(':', '')}</MyText>
                {
                    civDict[civ].uniqueTechs.map(tech =>
                        <TechCompBig key={tech} tech={tech}/>
                    )
                }
            </View>

            <View style={styles.box}>
                <MyText style={styles.heading}>{teamBonusTitle.replace(':', '')}</MyText>
                <MyText style={styles.content}><HighlightUnitAndTechs str={teamBonus}/></MyText>
            </View>

            <View style={styles.box}>
                <TechTree civ={civ}/>
            </View>
        </View>
    );
}

interface ICivCompProps {
    civ: Civ;
}

export function CivCompBig({civ}: ICivCompProps) {
    const styles = useStyles();
    const navigation = useNavigation<RootStackProp>();

    return (
        <TouchableOpacity key={civ} onPress={() => navigation.push('Civ', {civ})}>
            <View style={styles.civBlock}>
                <Image fadeDuration={0} style={styles.icon} source={getCivIcon(civ)}/>
                <View style={styles.civRow}>
                    <MyText style={styles.name}>{getCivNameById(civ)}</MyText>
                    <MyText style={styles.small} numberOfLines={1}>{getCivTeamBonus(civ) ?? ''}</MyText>
                </View>
            </View>
        </TouchableOpacity>
    );
}

type Mutable<Type> = {
    -readonly [Key in keyof Type]: Type[Key];
};

function makeMutable<T>(a: T) {
    return a as Mutable<T>;
}

export function CivList() {
    const styles = useStyles();
    const navigation = useNavigation<RootStackProp>();
    const [text, setText] = useState('');
    const [list, setList] = useState(makeMutable(civs) as Civ[]);

    const refresh = () => {
        setList(
            civs.filter(civ => getCivNameById(civ)?.toLowerCase().includes(text.toLowerCase()))
        );
    };

    useEffect(() => {
        refresh();
    }, [text]);

    const renderItem = (civ: Civ) => (
        <TouchableOpacity key={civ} onPress={() => navigation.push('Civ', {civ})}>
            <View style={styles.civBlock}>
                <Image fadeDuration={0} style={styles.icon} source={getCivIcon(civ)}/>
                <View style={styles.civRow}>
                    <MyText style={styles.name}>{getCivNameById(civ)}</MyText>
                    <MyText style={styles.small} numberOfLines={1}>{getCivTeamBonus(civ) ?? ''}</MyText>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.wrapper}>
            {
                appConfig.game === 'aoe2de' &&
                <Searchbar
                    style={styles.searchbar}
                    placeholder={getTranslation('unit.search.placeholder')}
                    onChangeText={text => setText(text)}
                    value={text}
                />
            }
            <FlatList
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps={'always'}
                data={orderCivs(list.filter(c => c != 'Indians'))}
                renderItem={({item, index}) => renderItem(item)}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

export function CivPage() {
    const styles = useStyles();

    const route = useRoute<RouteProp<RootStackParamList, 'Civ'>>();
    const civ = route.params?.civ as aoeCivKey;

    if (civ) {
        return (
            <ImageBackground imageStyle={styles.imageInner}  source={getCivHistoryImage(civ)} style={styles.image}>
                <ScrollView>
                    <CivDetails civ={civ}/>
                </ScrollView>
            </ImageBackground>
        );
    }

    return <CivList/>
}

const useStyles = createStylesheet((theme, darkMode) => StyleSheet.create({
    imageInner: {
        tintColor: darkMode === 'dark' ? 'white' : 'black',
        opacity: 0.1,
        resizeMode: "cover",
        alignSelf: 'flex-end',
        bottom: -50,
        top: undefined,
        height: 400,
    },
    image: {
        flex: 1,
    },
    title: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold',
    },
    heading: {
        marginVertical: 10,
        lineHeight: 20,
        fontWeight: 'bold',
    },
    box: {

    },
    content: {
        textAlign: 'left',
        lineHeight: 22,
    },
    bullet: {
        textAlign: 'left',
        lineHeight: 22,
        flexShrink: 0,
    },
    detailsContainer: {
        flex: 1,
        padding: 20,
    },
    icon: {
        width: iconWidth,
        height: iconHeight,
    },
    name: {
        lineHeight: 17,
    },
    civBlock: {
        flexDirection: 'row',
        marginVertical: 6,
        // backgroundColor: 'yellow',
    },
    civRow: {
        flex: 1,
        marginLeft: 10,
        // backgroundColor: 'blue',
    },
    civList: {

    },
    wrapper: {
        flex: 1,
    },
    searchbar: {
        borderRadius: 0,
        paddingHorizontal: 10,
    },
    container: {
        padding: 20,
    },
    row: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        // backgroundColor: 'blue',
    },
    small: {
        fontSize: 12,
        color: theme.textNoteColor,
    },
    bonusRow: {
        flexDirection: 'row',
    },
}));
