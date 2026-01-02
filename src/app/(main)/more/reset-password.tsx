import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from '@app/helper/translate';
import { createStylesheet } from '../../../theming-new';
import { Stack, useRouter } from 'expo-router';
import { ScrollView } from '@app/components/scroll-view';
import useAuth from '@/data/src/hooks/use-auth';
import { supabaseClient } from '@/data/src/helper/supabase';
import { useAccount } from '@app/queries/all';
import { Button } from '@app/components/button';
import { Field } from '@app/components/field';
import { useQueryClient } from '@tanstack/react-query';
import { showAlert } from '@app/helper/alert';

export default function ResetPasswordPage() {
    const styles = useStyles();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const getTranslation = useTranslation();
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
            showAlert(error.message);
        } else {
            showAlert(getTranslation('resetpassword.changed'));
            await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' });
            router.replace('/more/account');
        }

        setLoading(false);
    }

    return (
        <ScrollView contentContainerClassName="min-h-full p-5">
            <Stack.Screen options={{ title: getTranslation('resetpassword.title') }} />

            <View style={styles.container}>
                <View style={[styles.verticallySpaced, styles.mt20]}>
                    {/*<MyText>Password</MyText>*/}
                    <Field placeholder={getTranslation('resetpassword.placeholder.newpassword')} type="password" onChangeText={setPassword} value={password} autoFocus={true} />
                </View>

                <View style={[styles.verticallySpaced, styles.mt20]}>
                    <Button
                        disabled={loading}
                        onPress={() => changePassword()}
                    >
                        {getTranslation('resetpassword.button.change')}
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
