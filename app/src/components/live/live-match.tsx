import {StyleSheet, View} from 'react-native';
import {Image} from 'expo-image';
import React from 'react';
import {LivePlayer} from './live-player';
import {differenceInSeconds} from "date-fns";
import {TextLoader} from "../../view/components/loader/text-loader";
import MyListAccordion from "../../view/components/accordion";
import {ImageLoader} from "../../view/components/loader/image-loader";
import {MyText} from "../../view/components/my-text";
import {createStylesheet} from '../../theming-new';
import {ILobbiesMatch} from "../../api/helper/api.types";
import { Card } from '@app/components/card';
import { Text } from '../text';

interface IGameProps {
    data: ILobbiesMatch;
    expanded?: boolean;
    onPress?: () => void;
}

const formatDuration = (start: Date, finish: Date) => {
    const diffTime = differenceInSeconds(finish, start);
    if (!diffTime) return '00:00'; // divide by 0 protection
    const minutes = Math.abs(Math.floor(diffTime / 60) % 60).toString();
    const hours = Math.abs(Math.floor(diffTime / 60 / 60)).toString();
    return `${hours.length < 2 ? 0 + hours : hours}:${minutes.length < 2 ? 0 + minutes : minutes} min`;
};

export function LiveMatch({data, expanded = false, onPress}: IGameProps) {
    const styles = useStyles();
    if (data == null) {
        return (
            <Card>
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
            </Card>
        );
    }

    const players = data.players || [];

    return (
        <View className="gap-4">
            <Card direction="vertical" onPress={onPress}>
                <View style={styles.row}>
                    <Image style={styles.map} source={{uri: data.mapImageUrl}}/>
                    <View style={styles.header}>
                        <Text numberOfLines={1} variant="header-sm">
                            {data.mapName} - {data.name}
                        </Text>
                        <Text numberOfLines={1}>
                            {data.gameModeName}
                            {
                                data.server &&
                                <MyText> - {data.server}</MyText>
                            }
                        </Text>
                        <Text numberOfLines={1}>
                            {data.blockedSlotCount}/{data.totalSlotCount}
                            {
                                data.averageRating &&
                                <MyText> (~{data.averageRating})</MyText>
                            }
                        </Text>
                    </View>
                </View>
            </Card>
            {
                expanded && (
                    <Card>
                        <View style={styles.playerList} className="gap-2">
                            <LivePlayer key={'header'} player={null}/>
                            {
                                players.map((player, j) => <LivePlayer key={j} player={player}/>)
                            }
                        </View>
                    </Card>
                )
            }
        </View>
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
        // paddingTop: 20,
        // backgroundColor: 'purple'
    },
} as const));
