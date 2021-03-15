import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {IFetchedUser} from '../../service/user';
import {Button, Searchbar, shadow} from 'react-native-paper';
import {composeUserIdFromParts, UserInfo} from '../../helper/user';
import {getFlagIcon} from '../../helper/flags';
import {MyText} from "./my-text";
import {createStylesheet} from '../../theming-new';
import {useCavy} from '../testing/tester';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
    allUnitSections,
    Building,
    buildingSections,
    Civ,
    civs,
    clamp,
    getBuildingName,
    getCivNameById,
    getTechName,
    getUnitName,
    iconHeight,
    iconWidth,
    isVerifiedPlayer,
    Tech,
    techSections,
    Unit
} from '@nex/data';
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {getUnitIcon} from "../../helper/units";
import {getTechIcon} from "../../helper/techs";
import {getBuildingIcon} from "../../helper/buildings";
import {Highlight} from "../../helper/highlight";
import {getCivIcon} from "../../helper/civs";
import {queryItemCanceledAsync, queryItemHoveredAsync, queryItemSelectedAsync} from "../../helper/electron";

interface IPlayerProps {
    player: IFetchedUser;
    selectedUser?: (user: UserInfo) => void;
    actionText?: string;
    action?: (player: IFetchedUser) => React.ReactNode;
}

function Player({player, selectedUser, actionText, action}: IPlayerProps) {
    const generateTestHook = useCavy();
    const styles = useStyles();

    const onSelect = async () => {
        selectedUser!({
            id: composeUserIdFromParts(player.steam_id, player.profile_id),
            steam_id: player.steam_id,
            profile_id: player.profile_id,
            name: player.name,
        });
    };

    return (
            <TouchableOpacity
                ref={ref => generateTestHook('Search.Player.' + composeUserIdFromParts(player.steam_id, player.profile_id))({ props: { onPress: onSelect }})}
                onPress={onSelect}
            >
                <View style={styles.row}>
                    <View style={styles.cellName}>
                        <Image fadeDuration={0} style={styles.countryIcon} source={getFlagIcon(player.country)}/>
                        <MyText style={styles.name} numberOfLines={1}>
                            {player.name}
                            {
                                isVerifiedPlayer(player.profile_id) &&
                                <> <Icon solid name="check-circle" size={14} style={styles.verifiedIcon} /></>
                            }
                        </MyText>
                    </View>
                    <MyText style={styles.cellGames}>{player.games}</MyText>
                    <View style={styles.cellAction}>
                        {
                            action && action(player)
                        }
                        {
                            actionText && selectedUser &&
                            <Button
                                labelStyle={{fontSize: 13, marginVertical: 0}}
                                contentStyle={{height: 22}}
                                onPress={onSelect}
                                mode="contained"
                                compact
                                uppercase={false}
                                dark={true}
                            >
                                {actionText}
                            </Button>
                        }
                    </View>
                </View>
            </TouchableOpacity>
    );
}

interface ISearchProps {
    title?: string;
    selectedUser?: (user: UserInfo) => void;
    actionText?: string;
    action?: (player: IFetchedUser) => React.ReactNode;
}

export interface IQueryRow {
    key: string;
    title: string;
    highlight?: string;
    unit?: Unit;
    building?: Building;
    tech?: Tech;
    civ?: Civ;
}

interface ItemProps {
    civ?: Civ;
    tech?: Tech;
    unit?: Unit;
    building?: Building;
}

export function getItemIcon({civ, tech, unit, building}: ItemProps) {
    if (civ) {
        console.log('civ', civ);
        return getCivIcon(civ);
    }
    if (tech) {
        return getTechIcon(tech);
    }
    if (unit) {
        return getUnitIcon(unit);
    }
    if (building) {
        return getBuildingIcon(building);
    }
    return false;
}

function getNavCallback({civ, tech, unit, building}: ItemProps) {
    const navigation = useNavigation<RootStackProp>();
    if (civ) {
        return () => navigation.push('Civ', {civ: civ});
    }
    if (tech) {
        return () => navigation.push('Tech', {tech: tech});
    }
    if (unit) {
        return () => navigation.push('Unit', {unit: unit});
    }
    if (building) {
        return () => navigation.push('Building', {building: building});
    }
    return () => {};
}

export function SearchItem(props: IQueryRow) {
    const { key, title, unit, building, tech, civ, highlight } = props;
    const styles = useStyles();
    const navigation = useNavigation<RootStackProp>();
    return (
        <TouchableOpacity onPress={getNavCallback(props)}>
            <View style={styles.itemRow}>
                <Image fadeDuration={0} style={styles.itemIcon} source={getItemIcon(props)}/>
                <View style={styles.itemIconTitle}>
                    <MyText><Highlight str={title} highlight={highlight!}/></MyText>
                    {/*{*/}
                    {/*    subtitle != null &&*/}
                    {/*    <MyText style={styles.base.small}>{subtitle}</MyText>*/}
                    {/*}*/}
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default function SearchQuery({title, selectedUser, actionText, action}: ISearchProps) {
    const styles = useStyles();
    const [text, setText] = useState('');
    const [selectedItem, setSelectedItem] = useState<IQueryRow>();
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [items, setItems] = useState<IQueryRow[]>([]);

    const refresh = () => {
        const allUnits = allUnitSections.flatMap(s => s.data).map(u => ({
            key: getUnitName(u).toLowerCase(),
            title: getUnitName(u),
            unit: u,
        }));
        const allBuildings = buildingSections.flatMap(s => s.data).map(u => ({
            key: getBuildingName(u).toLowerCase(),
            title: getBuildingName(u),
            building: u,
        }));
        const allTechs = techSections.flatMap(s => s.data).map(u => ({
            key: getTechName(u).toLowerCase(),
            title: getTechName(u),
            tech: u,
        }));
        const allCivs = civs.map(u => ({
            key: getCivNameById(u).toLowerCase(),
            title: getCivNameById(u),
            civ: u,
        }));

        const allItems = [...allUnits, ...allBuildings, ...allTechs, ...allCivs];

        const filteredItems = allItems.filter(item => item.key.includes(text.toLowerCase())).filter((x,i) => i < 10);

        setItems(filteredItems);
    };

    useEffect(() => {
        refresh();
        setSelectedIndex(0);
    }, [text]);

    const pressed = (e: any) => {
        console.log(e.code);
        if (e.code == 'Escape') {
            queryItemCanceledAsync();
            setText('');
            e.preventDefault();
        }
        if (e.code == 'Enter') {
            // alert(items[selectedIndex+1].unit);
            if (selectedIndex > -1 && selectedIndex < items.length) {
                queryItemSelectedAsync(items[selectedIndex]);
                setText('');
            }
            e.preventDefault();
        }
        if (e.code == 'ArrowDown' || e.code == 'ArrowUp') {
            const direction = e.code == 'ArrowDown' ? 1 : -1;
            const newIndex = clamp(selectedIndex+direction, -1, items.length-1);
            if (newIndex > -1 && newIndex < items.length) {
                queryItemHoveredAsync(items[newIndex]);
            }
            setSelectedIndex(newIndex);
            e.preventDefault();
        }
    };

    console.log(selectedItem);

    // const renderInternal = (item: IRow, index: number) => {
    //     // if (unitLines[item] && text.length === 0) {
    //     //     return <UnitLineCompBig key={item} unitLine={item}/>
    //     // }
    //
    //     return <SearchItem key={`${index}`} highlight={text} title={item.title} civ={item.civ} tech={item.tech} building={item.building} unit={item.unit}/>
    //
    //     // if (item.civ) {
    //     //     return <CivCompBig key={item.civ} civ={item.civ}/>
    //     // }
    //     // if (item.tech) {
    //     //     return <TechCompBig key={item.tech} tech={item.tech} showCivBanner={true}/>
    //     // }
    //     // if (item.building) {
    //     //     return <BuildingCompBig key={item.building} building={item.building} showCivBanner={true}/>
    //     // }
    //     // if (item.unit) {
    //     //     return <UnitCompBig key={item.unit} unit={item.unit}/>
    //     // }
    //     return <View/>;
    // };

    const renderItem = ({item, index}: {item: IQueryRow, index: number}) => {
        // if (unitLines[item] && text.length === 0) {
        //     return <UnitLineCompBig key={item} unitLine={item}/>
        // }

        console.log('render', selectedItem);
        console.log('render2', text);
        return (
            <View style={{
                // backgroundColor: 'yellow'
                // borderRadius: 5,
                paddingHorizontal: 10,
                paddingTop: 10,
                backgroundColor: selectedIndex === index ? '#CCC' : 'transparent'
                // backgroundColor: selectedItem?.key === item.key ? '#CCC' : 'transparent'
            }}>
                <SearchItem key={`${index}`} highlight={text} title={item.title} civ={item.civ} tech={item.tech} building={item.building} unit={item.unit}/>
            </View>
        );
    };


    return (
            <View style={[styles.container, shadow(4) as ViewStyle]}>
                {
                    title &&
                    <MyText style={styles.centerText}>{title}</MyText>
                }

                <Searchbar
                        textAlign="left"
                        autoFocus={true}
                        onKeyPress={pressed}
                        style={styles.searchbar}
                        onChangeText={setText}
                        value={text}
                />

                <FlatList
                    extraData={{selectedItem, selectedIndex, text}}
                    keyboardShouldPersistTaps={'always'}
                    contentContainerStyle={styles.list}
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />

                {/*<SectionList*/}
                {/*    keyboardShouldPersistTaps={'always'}*/}
                {/*    contentContainerStyle={styles.list}*/}
                {/*    sections={list}*/}
                {/*    stickySectionHeadersEnabled={false}*/}
                {/*    renderItem={({item}) => {*/}
                {/*        // if (unitLines[item] && text.length === 0) {*/}
                {/*        //     return <UnitLineCompBig key={item} unitLine={item}/>*/}
                {/*        // }*/}
                {/*        return <UnitCompBig key={item} unit={item}/>*/}
                {/*    }}*/}
                {/*    renderSectionHeader={({ section: { title } }) => {*/}
                {/*        // if (civ) {*/}
                {/*        //     return (*/}
                {/*        //         <View style={styles.row}>*/}
                {/*        //             /!*<Image fadeDuration={0} source={getCivIcon(civ)} style={styles.unitIcon}/>*!/*/}
                {/*        //             <Text style={styles.heading}>{title}</Text>*/}
                {/*        //         </View>*/}
                {/*        //     );*/}
                {/*        // }*/}
                {/*        return (*/}
                {/*            <MyText style={styles.heading}>{getTranslation(title)}</MyText>*/}
                {/*        );*/}
                {/*    }}*/}
                {/*    keyExtractor={(item, index) => index.toString()}*/}
                {/*/>*/}
            </View>
    );
}

const useStyles = createStylesheet((theme, darkMode) => StyleSheet.create({
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10, // TODO ROLLBACK
        // backgroundColor: 'blue',
    },
    itemIcon: {
        width: iconWidth,
        height: iconHeight,
        // borderWidth: 1,
        // borderColor: '#555',
    },
    itemIconTitle: {
        flex: 1,
        paddingLeft: 8,
        // backgroundColor: 'red',
    },
    heading: {
        paddingVertical: 12,
        marginBottom: 5,
        fontWeight: 'bold',
        // backgroundColor: theme.backgroundColor,
    },
    verifiedIcon: {
        marginLeft: 5,
        color: theme.linkColor,
    },
    centerText: {
        textAlign: 'center',
        marginVertical: 20,
    },
    note: {
        lineHeight: 20,
        color: theme.textNoteColor,
    },
    countryIcon: {
        width: 21,
        height: 15,
        marginRight: 5,
    },
    cellRating: {
        width: 40,
    },
    cellName: {
        // backgroundColor: 'red',
        flex: 2.7,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 5,
    },
    name: {
        flex: 1,
    },
    cellGames: {
        flex: 1.2,
    },
    cellAction: {
        flex: 1.5,
    },
    cellWon: {
        width: 110,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
        padding: 3,
        borderRadius: 5,
        marginRight: 30,
        marginLeft: 30,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 3,
        padding: 3,
    },
    list: {
        // padding: 20,
    },
    container: {
        // paddingTop: 20,
        // flex: 1,
        // elevation: 4,
        height: 'auto',

        borderColor: darkMode === 'dark' ? '#444' :  '#CCC',
        borderWidth: 1,
        borderRadius: 10,

        backgroundColor: theme.backgroundColor,

        // backgroundColor: 'red',
    },
    searchbar: {
        borderRadius: 10,
        borderBottomWidth: 0,
        elevation: 0,

        // marginTop: 15,
        // marginBottom: 15,
        // marginRight: 30,
        // marginLeft: 30,
    },
    // searchbar: {
    //     marginTop: 5,
    //     borderRadius: 0,
    //     paddingHorizontal: 10,
    // },
    // list: {
    //     marginRight: 30,
    //     marginLeft: 30,
    //     paddingBottom: 20,
    // },
    // container: {
    //     flex: 1,
    // },
}));
