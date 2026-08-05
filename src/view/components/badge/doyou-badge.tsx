import { PressableOpacity } from '@app/components/pressable-opacity';
import {Linking, Platform, StyleSheet} from "react-native";
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
        <PressableOpacity onPress={() => openLink(channelUrl)}>
            <Badge
                label="Douyu"
                labelColor="#EEEEEE"
                labelTextColor="#000000"
                logoPng={require('../../../../assets/icon/douyu.png')}
                logoColor="accent-[#FFFFFF]"
            />
        </PressableOpacity>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({}));
