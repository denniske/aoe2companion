import {Linking, Platform, StyleSheet, TouchableOpacity} from "react-native";
import React from "react";
import {createStylesheet} from '../../../theming-new';
import Badge from './badge';
import {openLink} from "../../../helper/url";


interface Props {
    channelUrl: string;
}

export default function DouyuBadge(props: Props) {
    const { channelUrl } = props;

    return (
        <TouchableOpacity onPress={() => openLink(channelUrl)}>
            <Badge
                label="Douyu"
                labelColor="#FFFFFF"
                labelTextColor="#000000"
                logoPng={require('../../../../assets/icon/douyu.png')}
                logoColor="white" />
        </TouchableOpacity>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({}));
