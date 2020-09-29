import {Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {MyText} from "./my-text";
import React from "react";
import {noop} from "@nex/data";
import {createStylesheet} from '../../theming-new';


interface Props {
    visible: boolean;
    onClose: () => void;
    children?: React.ReactNode,
    title: string;
}

export default function SimpleModal(props: Props) {
    const styles = useStyles();

    const { visible, onClose, children, title } = props;

    return (
        <Modal transparent={true} visible={visible}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.centeredView}>
                    <TouchableWithoutFeedback onPress={noop}>
                        <View style={styles.modalView}>
                            <TouchableOpacity style={styles.modalCloseIcon} onPress={onClose}>
                                <Icon name={'close'} size={24}/>
                            </TouchableOpacity>
                            <MyText style={styles.modalText} numberOfLines={1}>{title}</MyText>
                            {children}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 0,
        backgroundColor: "white",
        borderRadius: 5,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '80%',
        minHeight: 300,
    },
    modalText: {
        paddingVertical: 3,
        marginBottom: 15,
        textAlign: "center",
        color: 'black',
    },
    modalHeader: {
        flexDirection: 'row',
        // backgroundColor: 'yellow'
    },
    modalCloseIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
    }
}));
