import * as React from 'react';
import { useState } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import {useAppTheme} from "../../theming";
import {MaterialCommunityIcons} from '@expo/vector-icons';


type Props = {
    left?: (props: {}) => React.ReactNode;
    expanded?: boolean;
    expandable?: boolean;
    onPress?: () => void;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

export default function MyListAccordion(props: Props) {
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
                <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.container]}
                        onPress={handlePress}
                >
                    <View style={styles.row} pointerEvents="none">
                        <View style={[styles.item, styles.content]}>
                            {left ? left({}):null}
                        </View>
                        <View style={styles.item}>
                            <MaterialCommunityIcons
                                name={expanded ? 'chevron-up':'chevron-down'}
                                color={expandable ? theme.textColor : theme.skeletonColor}
                                style={{opacity: expandable ? 1 : 1}}
                                size={30}
                            />
                        </View>
                    </View>
                </TouchableOpacity>

                {expanded? 
                    <View style={styles.row2}>
                        {React.Children.map(children, child => {
                            if (React.isValidElement(child)) {
                                return React.cloneElement(child, {
                                    style: [styles.child, child.props.style],
                                } as any);
                            }
                            return child;
                        })}
                    </View>
                : null}
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
