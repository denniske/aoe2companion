import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { createStylesheet } from '../../theming-new';
import { Stack, useRouter } from 'expo-router';
import { ScrollView } from '@app/components/scroll-view';
import useAuth from '../../../../data/src/hooks/use-auth';
import { usePaperTheme } from '@app/theming';
import { supabaseClient } from '../../../../data/src/helper/supabase';
import { useAccount } from '@app/queries/all';
import { Button } from 'react-native-paper';
import { Field } from '@app/components/field';
import { useQueryClient } from '@tanstack/react-query';

export default function ResetPasswordPage() {
    const styles = useStyles();
    const paperTheme = usePaperTheme();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const queryClient = useQueryClient();
    const user = useAuth();
    const account = useAccount();

    async function changePassword() {
        setLoading(true);

        const { data, error } = await supabaseClient.auth.updateUser({
            password,
        });

        console.log('data', data);
        console.log('error', error);

        if (error) {
            Alert.alert(error.message);
        } else {
            Alert.alert('Your password has been changed!');
            await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' });
            router.replace('/more/account');
        }

        setLoading(false);
    }

    return (
        <ScrollView contentContainerStyle="min-h-full p-5">
            <Stack.Screen options={{ title: 'Reset Password' }} />

            <View style={styles.container}>
                <View style={[styles.verticallySpaced, styles.mt20]}>
                    {/*<MyText>Password</MyText>*/}
                    <Field placeholder="New password" type="password" onChangeText={setPassword} value={password} autoFocus={true} />
                </View>

                <View style={[styles.verticallySpaced, styles.mt20]}>
                    <Button
                        disabled={loading}
                        onPress={() => changePassword()}
                        mode="contained"
                        uppercase={false}
                        dark={true}
                        buttonColor={paperTheme.colors.primary}
                    >
                        Change password
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({

        container: {
            // backgroundColor: 'yellow',
            // marginTop: 40,
            padding: 12,
        },
        verticallySpaced: {
            paddingTop: 4,
            paddingBottom: 4,
            alignSelf: 'stretch',
        },
        mt20: {
            marginTop: 20,
        },

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
