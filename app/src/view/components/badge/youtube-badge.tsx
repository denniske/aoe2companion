import {Linking, Platform, StyleSheet, TouchableOpacity} from "react-native";
import React from "react";
import {createStylesheet} from '../../../theming-new';
import Badge from './badge';
import {openLink} from "../../../helper/url";


interface Props {
    channel: string;
}

export default function YoutubeBadge(props: Props) {
    const { channel } = props;

    return (
        <TouchableOpacity onPress={() => openLink(`https://www.youtube.com/channel/${channel}`)}>
            <Badge
                label="Youtube"
                labelColor="#FF0000"
                logoIcon="youtube"
                logoColor="white" />
        </TouchableOpacity>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({}));
