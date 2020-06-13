import * as React from 'react';
import { useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle, } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


type Props = {
    left?: (props: {}) => React.ReactNode;
    expanded?: boolean;
    onPress?: () => void;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

export default function MyListAccordion(props: Props) {
    const [expanded, setExpanded] = useState(props.expanded);

    const {
        left,
        children,
        style,
    } = props;

    const handlePress = () => setExpanded(!expanded);

    return (
            <View>
                <TouchableRipple
                        style={[styles.container, style]}
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
                            <Icon name={expanded ? 'chevron-up':'chevron-down'} size={30}/>
                        </View>
                    </View>
                </TouchableRipple>

                <View style={styles.row}>
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
        paddingBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
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
        margin: 0,
    },
    child: {
        paddingBottom: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
});
