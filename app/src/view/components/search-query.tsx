import React, {useEffect, useState} from 'react';
import {FlatList, Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {IFetchedUser} from '../../service/user';
import {Button, Searchbar, shadow} from 'react-native-paper';
import {MyText} from "./my-text";
import {createStylesheet} from '../../theming-new';
import {useCavy} from '../testing/tester';
import {FontAwesome5} from "@expo/vector-icons";
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
import {fakeBuilds} from "../../../../data/src/helper/builds";
import {useAppTheme} from "../../theming";
import {IConfig, saveConfigToStorage} from "../../service/storage";
import {setConfig, useMutate, useSelector} from "../../redux/reducer";
import {CountryImage} from './country-image';

interface IPlayerProps {
    player: IFetchedUser;
    selectedUser?: (user: any) => void;
    actionText?: string;
    action?: (player: IFetchedUser) => React.ReactNode;
}

function Player({player, selectedUser, actionText, action}: IPlayerProps) {
    const generateTestHook = useCavy();
    const styles = useStyles();

    const onSelect = async () => {
        selectedUser!({
            steam_id: player.steam_id,
            profile_id: player.profile_id,
            name: player.name,
        });
    };

    return (
            <TouchableOpacity
                ref={ref => generateTestHook('Search.Player.' + player.profile_id)({ props: { onPress: onSelect }})}
                onPress={onSelect}
            >
                <View style={styles.row}>
                    <View style={styles.cellName}>
                        <CountryImage country={player.country} />
                        <MyText style={styles.name} numberOfLines={1}>
                            {player.name}
                            {
                                isVerifiedPlayer(player.profile_id) &&
                                <> <FontAwesome5 solid name="check-circle" size={14} style={styles.verifiedIcon} /></>
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
    selectedUser?: (user: any) => void;
    actionText?: string;
    action?: (player: IFetchedUser) => React.ReactNode;
}

export interface IQueryRow {
    key: string;
    title: string;
    subtitle?: string;
    highlight?: string;
    unit?: Unit;
    building?: Building;
    tech?: Tech;
    civ?: Civ;
    image?: string;
    build?: number;
    callback?: () => void;
}

interface ItemProps {
    civ?: Civ;
    tech?: Tech;
    unit?: Unit;
    building?: Building;
    image?: string;
}

export function getItemIcon({civ, tech, unit, building, image}: ItemProps): ImageSourcePropType {
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
    if (image) {
        return {uri: image};
    }
    return {};
}

export function SearchItem(props: IQueryRow) {
    const { key, title, subtitle, unit, building, tech, civ, highlight, callback } = props;
    const styles = useStyles();
    return (
        <TouchableOpacity onPress={callback}>
            <View style={styles.itemRow}>
                <Image fadeDuration={0} style={styles.itemIcon} source={getItemIcon(props)}/>
                <View style={styles.itemIconTitle}>
                    <MyText><Highlight str={title} highlight={highlight!}/></MyText>
                    {
                        subtitle != null &&
                        <MyText style={styles.base.small}>{subtitle}</MyText>
                    }
                </View>
            </View>
        </TouchableOpacity>
    );
}

type Source = 'units' | 'buildOrders';

function getSourceItems(source: Source): IQueryRow[] {
    if (source === "units") {
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
        return [...allUnits, ...allBuildings, ...allTechs, ...allCivs];
    }
    if (source === "buildOrders") {
        return fakeBuilds.map(build => ({
            key: build.title.toLowerCase() + ' ' + build.attributes.map(x => x.toLowerCase()).join(' ') + ' ' + build.civilization.toLowerCase(),
            title: build.title,
            subtitle: build.civilization.toLowerCase() + ' ' + build.attributes.map(x => x.toLowerCase()).join(' '),
            image: build.imageURL,
            build: build.id,
        }));
    }
    return [];
}

export default function SearchQuery({title, selectedUser, actionText, action}: ISearchProps) {
    const styles = useStyles();
    const theme = useAppTheme();
    const [text, setText] = useState('');
    const [selectedItem, setSelectedItem] = useState<IQueryRow>();
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [source, setSource] = useState<Source>('units');
    const [items, setItems] = useState<IQueryRow[]>([]);
    const config = useSelector(state => state.config);
    const mutate = useMutate();

    console.log(theme);

    const refresh = () => {
        const allItems = getSourceItems(source);
        const parts = text.toLowerCase().split(' ');
        const filteredItems = allItems.filter(item => parts.every(part => item.key.includes(part)));
        setItems(filteredItems.filter((x,i) => i < 10));
    };

    const toggleDarkMode = async () => {
        const newConfig: IConfig = {
            ...config,
            darkMode: config.darkMode === 'light' ? 'dark' : 'light',
        };
        await saveConfigToStorage(newConfig)
        mutate(setConfig(newConfig));
    };

    // const refresh = () => {
    //     const allItems = fakeBuilds.map(build => ({
    //         key: build.title.toLowerCase() + ' ' + build.attributes.map(x => x.toLowerCase()).join(' ') + ' ' + build.civilization.toLowerCase(),
    //         title: build.title,
    //         subtitle: build.civilization.toLowerCase() + ' ' + build.attributes.map(x => x.toLowerCase()).join(' '),
    //         image: build.imageURL,
    //     }));
    //
    //     console.log(allItems.map(k => k.key));
    //
    //     const parts = text.toLowerCase().split(' ');
    //     const filteredItems = allItems.filter(item => parts.every(part => item.key.includes(part)));
    //
    //     setItems(filteredItems.filter((x,i) => i < 10));
    // };

    useEffect(() => {
        refresh();
        setSelectedIndex(0);
    }, [text, source]);

    const selected = (index: number) => {
        queryItemSelectedAsync(items[index]);
        setText('');
    };

    const pressed = (e: any) => {
        console.log(e.code);
        if (e.code == 'Tab') {
            setSource(source === 'units' ? 'buildOrders' : 'units');
            e.preventDefault();
        }
        if (e.code == 'F2') {
            toggleDarkMode();
            e.preventDefault();
        }
        if (e.code == 'Escape') {
            queryItemCanceledAsync();
            setText('');
            e.preventDefault();
        }
        if (e.code == 'Enter') {
            // alert(items[selectedIndex+1].unit);
            if (selectedIndex > -1 && selectedIndex < items.length) {
                selected(selectedIndex);
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
        // console.log('render', selectedItem);
        // console.log('render2', text);
        return (
            <View style={{
                // backgroundColor: 'yellow'
                paddingHorizontal: 10,
                paddingTop: 10,
                backgroundColor: selectedIndex === index ? theme.hoverBackgroundColor : 'transparent'
            }}>
                <SearchItem key={`${index}`} callback={() => selected(index)} highlight={text} title={item.title} civ={item.civ} tech={item.tech} building={item.building} unit={item.unit} image={item.image} subtitle={item.subtitle}/>
            </View>
        );
    };

    return (
            <View style={[styles.container, shadow(4) as ViewStyle]}>
                {
                    title &&
                    <MyText style={styles.centerText}>{title}</MyText>
                }

                <View style={styles.tabInfo}>
                    <MyText>TAB</MyText>
                </View>

                <Searchbar
                        textAlign="left"
                        autoFocus={true}
                        onKeyPress={pressed}
                        style={styles.searchbar}
                        placeholder={source === 'units' ? 'unit, building, tech, civ' : 'build order (name, civ, map)'}
                        onChangeText={setText}
                        value={text}
                />

                <FlatList
                    extraData={{selectedItem, selectedIndex, text, source}}
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
    tabInfo: {
        position: 'absolute',
        right: 43,
        top: 9,
        color: theme.textColor,
        backgroundColor: theme.hoverBackgroundColor,
        zIndex: 100,
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderRadius: 3,
    },
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
