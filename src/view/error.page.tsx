import React from 'react';
import {ScrollView, Share, StyleSheet, View} from 'react-native';
import {ITheme, makeVariants, useAppTheme, useTheme} from "../theming";
import {MyText} from "./components/my-text";
import {Button} from "react-native-paper";
import {useSelector} from "../redux/reducer";

export default function ErrorPage() {
    const styles = useTheme(variants);
    const theme = useAppTheme();
    const errors = useSelector(state => state.errors);

    const sendErrorDetails = async () => {
        await Share.share({
            message: JSON.stringify(errors),
        }, {
            subject: JSON.stringify(errors),
        });
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}>
            <Button mode="outlined" onPress={sendErrorDetails}>Send Error Details</Button>
            <MyText/>
            <MyText/>
            <MyText>Troubleshoot info:</MyText>
            <MyText/>
            {
                errors &&
                errors.map((error, i) =>
                    <View key={i}>
                        <MyText>
                            {error.title}
                        </MyText>
                        <MyText>{error.extra?.url}</MyText>
                        <MyText>{error.extra?.status}</MyText>
                        {/*<MyText>*/}
                        {/*    {JSON.stringify(error.extra)}*/}
                        {/*</MyText>*/}
                        <MyText/>
                    </View>
                )
            }
        </ScrollView>
    );
}

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
        },
        content: {
            // alignItems: 'center',
        },
        text: {
            textAlign: 'center',
        },
        note: {
            color: theme.textNoteColor,
            textAlign: 'center',
        },
    });
};

const variants = makeVariants(getStyles);
