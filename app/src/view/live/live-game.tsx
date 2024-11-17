import {StyleSheet, View} from 'react-native';
import {Image} from 'expo-image';
import React from 'react';
import {LivePlayer} from './live-player';
import {differenceInSeconds} from "date-fns";
import {TextLoader} from "../components/loader/text-loader";
import MyListAccordion from "../components/accordion";
import {ImageLoader} from "../components/loader/image-loader";
import {MyText} from "../components/my-text";
import {createStylesheet} from '../../theming-new';
import {ILobbiesMatch} from "../../api/helper/api.types";

interface IGameProps {
    data: ILobbiesMatch;
    expanded?: boolean;
}

const formatDuration = (start: Date, finish: Date) => {
    const diffTime = differenceInSeconds(finish, start);
    if (!diffTime) return '00:00'; // divide by 0 protection
    const minutes = Math.abs(Math.floor(diffTime / 60) % 60).toString();
    const hours = Math.abs(Math.floor(diffTime / 60 / 60)).toString();
    return `${hours.length < 2 ? 0 + hours : hours}:${minutes.length < 2 ? 0 + minutes : minutes} min`;
};

export function LiveGame({data, expanded = false}: IGameProps) {
    const styles = useStyles();
    if (data == null) {
        return (
            <View>
                <MyListAccordion
                    style={styles.accordion}
                    expanded={expanded}
                    left={props => (
                        <View style={styles.row}>
                            <ImageLoader style={styles.map}/>
                            <View style={styles.header}>
                                <TextLoader numberOfLines={1} style={[styles.matchTitle, {marginVertical: 2, height: 10}]}/>
                                <TextLoader numberOfLines={1} style={[styles.matchContent, {marginVertical: 2, height: 10}]}/>
                                <TextLoader numberOfLines={1} style={[styles.matchContent, {marginVertical: 2, height: 10}]}/>
                            </View>
                        </View>
                    )}
                ><View/></MyListAccordion>
            </View>
        );
    }

    const players = data.players || [];

    return (
        <MyListAccordion
            style={styles.accordion}
            expanded={expanded}
            expandable={true}
            left={props => (
                <View style={styles.row}>
                    <Image style={styles.map} source={{uri: data.mapImageUrl}}/>
                    <View style={styles.header}>
                        <MyText numberOfLines={1} style={styles.matchTitle}>
                            {data.mapName} - {data.name}
                        </MyText>
                        <MyText numberOfLines={1} style={styles.matchContent}>
                            {data.gameModeName}
                            {
                                data.server &&
                                <MyText> - {data.server}</MyText>
                            }
                        </MyText>
                        <MyText numberOfLines={1} style={styles.matchContent}>
                            {data.blockedSlotCount}/{data.totalSlotCount}
                            {
                                data.averageRating &&
                                <MyText> (~{data.averageRating})</MyText>
                            }
                        </MyText>
                    </View>
                </View>
            )}
        >
            <View style={styles.playerList}>
                <LivePlayer key={'header'} player={null}/>
                {
                    players.map((player, j) => <LivePlayer key={j} player={player}/>)
                }
            </View>
        </MyListAccordion>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({
    accordion: {
        // backgroundColor: 'yellow',
        paddingBottom: 20,
    },
    header: {
        // backgroundColor: 'red',
        flex: 1,
    },
    map: {
        marginRight: 10,
        width: 50,
        height: 50,
    },
    row: {
        // backgroundColor: 'purple',
        flexDirection: 'row',
    },
    matchTitle: {
        fontWeight: 'bold',
        flex: 1,
    },
    matchContent: {
        flex: 1,
    },
    playerList: {
        flex: 1,
        paddingTop: 20,
        // backgroundColor: 'purple'
    },
} as const));
