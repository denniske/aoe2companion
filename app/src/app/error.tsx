import React from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import { useAppTheme } from '../theming';
import { MyText } from '@app/view/components/my-text';
import { Button } from 'react-native-paper';
import { useSelector } from '../redux/reducer';
import Space from '@app/view/components/space';
import { createStylesheet } from '../theming-new';

export default function ErrorPage() {
    const styles = useStyles();
    const theme = useAppTheme();
    const errors = useSelector((state) => state.errors);

    const sendErrorDetails = async () => {
        await Share.share(
            {
                message: JSON.stringify(errors),
            },
            {
                subject: JSON.stringify(errors),
            }
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Button mode="outlined" onPress={sendErrorDetails}>
                Send Error Details
            </Button>
            <Space />
            <Space />
            <MyText>Troubleshoot info:</MyText>
            <Space />
            {errors &&
                errors.map((error, i) => (
                    <View key={i}>
                        <MyText>{error.title}</MyText>
                        <MyText>{error.extra?.url}</MyText>
                        <MyText>{error.extra?.status}</MyText>
                        {/*<MyText>*/}
                        {/*    {JSON.stringify(error.extra)}*/}
                        {/*</MyText>*/}
                        <Space />
                    </View>
                ))}
        </ScrollView>
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
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
    })
);
