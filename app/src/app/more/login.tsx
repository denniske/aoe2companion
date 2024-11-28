import React from 'react';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { MyText } from '@app/view/components/my-text';
import { createStylesheet } from '../../theming-new';
import { getTranslation } from '../../helper/translate';
import { Stack } from 'expo-router';
import { ScrollView } from '@app/components/scroll-view';

export default function LoginPage() {
    const styles = useStyles();
    // const appStyles = useTheme(appVariants);
    // const [state, setState] = useState('');

    return (
        <ScrollView contentContainerStyle="min-h-full items-center p-5">
            <Stack.Screen options={{ title: getTranslation('account.title') }} />

            <MyText style={styles.title}>Login</MyText>





        </ScrollView>
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        title: {
            marginTop: 20,
            fontSize: 16,
            fontWeight: 'bold',
        },
        heading: {
            marginTop: 20,
            fontWeight: 'bold',
            marginBottom: 5,
        },
        content: {
            marginBottom: 5,
        },
    } as const)
);
