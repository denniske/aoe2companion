import * as React from 'react';
import { useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle, } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppTheme, usePaperTheme} from "../../theming";
import {MyText} from "./my-text";


type Props = {
    left?: (props: {}) => React.ReactNode;
    expanded?: boolean;
    expandable?: boolean;
    onPress?: () => void;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

export default function MyListAccordion(props: Props) {
    const paperTheme = usePaperTheme();
    const theme = useAppTheme();
    const [expanded, setExpanded] = useState(props.expanded);

    const {
        left,
        children,
        style,
        expandable,
        onPress,
    } = props;

    const handlePress = () => {
        setExpanded(!expanded);
        onPress?.();
    };

    return (
            <View style={style}>
                <TouchableRipple
                        style={[styles.container]}
                        onPress={handlePress}
                        accessibilityTraits="button"
                        accessibilityComponentType="button"
                        accessibilityRole="button"
                >
                    <View style={styles.row} pointerEvents="none">
                        <View style={[styles.item, styles.content]}>
                            {left ? left({}):null}
                        </View>
                        <View style={styles.item}>
                            <Icon name={expanded ? 'chevron-up':'chevron-down'} color={expandable ? paperTheme.colors.text : theme.skeletonColor} style={{opacity: expandable ? 1 : 1}} size={30}/>
                        </View>
                    </View>
                </TouchableRipple>

                <View style={styles.row2}>
                    {expanded
                            ? React.Children.map(children, child => {
                                if (React.isValidElement(child)) {
                                    return React.cloneElement(child, {
                                        style: [styles.child, child.props.style],
                                    });
                                }
                                return child;
                            })
                            :null}
                </View>
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // paddingBottom: 10,
        // backgroundColor: 'red',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    row2: {
        flexDirection: 'row',
        // backgroundColor: 'green'

    },
    multiline: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
    },
    description: {
        fontSize: 14,
    },
    item: {
        // backgroundColor: 'purple',
        margin: 0,
    },
    child: {
        // paddingBottom: 20,
    },
    content: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        marginRight: 10,
    },
});
