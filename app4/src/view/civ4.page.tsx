import React, {Fragment} from 'react';
import {FlatList, Image, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {aoeCivKey, Civ, civs, getCivNameById, getCivTeamBonus, iconHeight, iconWidth, orderCivs} from "@nex/data";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import IconHeader from "../../../app/src/view/components/navigation-header/icon-header";
import {RootStackParamList, RootStackProp} from "../../../app/App2";
import TextHeader from "../../../app/src/view/components/navigation-header/text-header";
import {getTranslation} from "../../../app/src/helper/translate";
import {getCivHistoryImage, getCivIcon} from "../../../app/src/helper/civs";
import {MyText} from "../../../app/src/view/components/my-text";
import {appConfig} from "@nex/dataset";
import {createStylesheet} from "../../../app/src/theming-new";
import {getCivInfo, getCivStrategies} from "../../../data4/src";


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

    const [timeRange, strategies, description, ...infos] = getCivInfo(civ);

    const infoList = [];
    for (let i = 0; i < infos.length; i+=2) {
        infoList.push({
            title: infos[i],
            text: infos[i+1],
        });
    }

    return (
        <View style={styles.detailsContainer}>
            <MyText style={styles.infoTimeRange}>{timeRange}</MyText>
            <MyText style={styles.infoStrategy}>{strategies}</MyText>
            <MyText style={styles.contentDescription}>{description}</MyText>

            {
                infoList.map(({title, text}) => (
                    <Fragment key={title}>
                        <MyText style={styles.infoTitle}>{title}</MyText>
                        <MyText style={styles.content}>{text.replaceAll('\\r\\n', '\n')}</MyText>
                    </Fragment>
                ))
            }
        </View>
    );
}

export function CivList() {
    const styles = useStyles();
    const navigation = useNavigation<RootStackProp>();

    const renderItem = (civ: Civ) => (
        <TouchableOpacity key={civ} onPress={() => navigation.push('Civ', {civ})}>
            <View style={styles.civBlock}>
                <Image fadeDuration={0} style={styles.icon} source={getCivIcon(civ)}/>
                <View style={styles.civRow}>
                    <MyText style={styles.name}>{getCivNameById(civ)}</MyText>
                    <MyText style={styles.small} numberOfLines={1}>
                        {getCivStrategies(civ) ?? ''}
                    </MyText>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <FlatList
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps={'always'}
            data={orderCivs(civs)}
            renderItem={({item, index}) => renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
        />
    );
}

export function CivPage() {
    const styles = useStyles();

    const route = useRoute<RouteProp<RootStackParamList, 'Civ'>>();
    const civ = route.params?.civ as aoeCivKey;

    if (civ) {
        return (
            // <ImageBackground imageStyle={styles.imageInner}  source={getCivHistoryImage(civ)} style={styles.image}>
                <ScrollView>
                    <CivDetails civ={civ}/>
                </ScrollView>
            // </ImageBackground>
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
    infoTimeRange: {
        color: theme.textNoteColor,
        textAlign: 'left',
        lineHeight: 22,
        // fontWeight: 'bold',
        marginVertical: 0,
    },
    infoStrategy: {
        color: theme.textNoteColor,
        textAlign: 'left',
        lineHeight: 22,
        // fontWeight: 'bold',
        marginBottom: 5,
    },
    infoTitle: {
        // color: '#DFB568',
        textAlign: 'left',
        lineHeight: 22,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 8,
    },
    contentDescription: {
        textAlign: 'left',
        lineHeight: 22,
        marginVertical: 12,
    },
    content: {
        textAlign: 'left',
        lineHeight: 22,
    },
    detailsContainer: {
        flex: 1,
        padding: 20,
    },
    icon: {
        width: 30*1.8*1.1,
        height: 30*1.1,
    },
    name: {
        lineHeight: 17,
    },
    civBlock: {
        flexDirection: 'row',
        marginVertical: 8,
        // backgroundColor: 'yellow',
    },
    civRow: {
        flex: 1,
        marginLeft: 10,
        // backgroundColor: 'blue',
    },
    civList: {

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
