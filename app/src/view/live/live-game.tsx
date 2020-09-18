import {Image, StyleSheet, Text, View} from 'react-native';
import {getString} from '../../helper/strings';
import {formatAgo} from '../../helper/util';
import React from 'react';
import {LivePlayer} from './live-player';
import {ILobbyMatchRaw, IMatch} from "../../helper/data";
import {getMapImage, getMapImageByLocationString, getMapName} from "../../helper/maps";
import {groupBy} from "lodash-es";
import {differenceInSeconds} from "date-fns";
import {ITheme, makeVariants, useTheme} from "../../theming";
import {TextLoader} from "../components/loader/text-loader";
import MyListAccordion from "../components/accordion";
import {ImageLoader} from "../components/loader/image-loader";
import {MyText} from "../components/my-text";

interface IGameProps {
    data: ILobbyMatchRaw;
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
    const styles = useTheme(variants);
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

    const players = data.players;

    return (
        <MyListAccordion
            style={styles.accordion}
            expanded={expanded}
            expandable={true}
            left={props => (
                <View style={styles.row}>
                    <Image style={styles.map} source={getMapImageByLocationString(data.location)}/>
                    <View style={styles.header}>
                        <MyText numberOfLines={1} style={styles.matchTitle}>
                            {data.location} - {data.name}
                        </MyText>
                        <MyText numberOfLines={1} style={styles.matchContent}>
                            {getString('leaderboard', data.ratingType)}
                            {
                                data.server &&
                                <MyText> - {data.server}</MyText>
                            }
                        </MyText>
                        <MyText numberOfLines={1} style={styles.matchContent}>
                            {data.status}
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

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
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
    });
};

const variants = makeVariants(getStyles);
