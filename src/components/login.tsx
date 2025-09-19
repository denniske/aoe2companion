import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, TouchableOpacity } from 'react-native';
import { useTranslation } from '@app/helper/translate';
import { supabaseClient } from '@/data/src/helper/supabase';
import { Button } from '@app/components/button';
import { Field } from '@app/components/field';
import { useQueryClient } from '@tanstack/react-query';
import { useAccount } from '@app/queries/all';
import { Text } from '@app/components/text';
import { showAlert } from '@app/helper/alert';
import { accountIsEmpty, accountMigrateFromAnonymous } from '@app/api/account';

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabaseClient.auth.startAutoRefresh()
    } else {
        supabaseClient.auth.stopAutoRefresh()
    }
})

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const getTranslation = useTranslation();
    const account = useAccount();
    const queryClient = useQueryClient();

    // console.log('LOGIN user', user);

    async function resetPassword() {
        setLoading(true)

        const { error } = await supabaseClient.auth.resetPasswordForEmail(
            email,
            {
                redirectTo: 'https://www.aoe2companion.com',
            }
        );

        if (error) {
            showAlert(error.message)
        } else {
            showAlert(getTranslation('login.inboxreset'))
        }

        setLoading(false)

        await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' })
    }

    async function forgotPassword() {
        showAlert(
            getTranslation('login.dialog.title.resetpassword'),
            getTranslation('login.dialog.message.resetpassword', { email }),
            [
                { text: getTranslation('login.dialog.cancel'), style: 'cancel' },
                { text: getTranslation('login.dialog.confirm'), onPress: resetPassword },
            ],
            { cancelable: false }
        );
    }

    async function migrateFromAnonymous(existingSessionAccountId: string, existingSessionAccessToken: string) {
        const { error, result } = await accountMigrateFromAnonymous(
            existingSessionAccountId, existingSessionAccessToken
        );
        if (result === 'success') {
            showAlert(
                getTranslation('login.dialog.title.migrate.success'),
                getTranslation('login.dialog.message.migrate.success')
            );
        }
        if (error) {
            showAlert(error)
        }
    }

    async function signInWithEmail() {
        setLoading(true)

        const { data } = await supabaseClient.auth.getSession();

        const existingSessionWasAnonymous = data.session?.user?.is_anonymous;
        const existingSessionAccountId = data.session?.user.id;
        const existingSessionAccessToken = data.session?.access_token;
        const existingAccountProfileId = account.data?.profileId;
        const existingAccountFollowedPlayerCount = account.data?.followedPlayers.length ?? 0;

        const { error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) {
            setLoading(false);
            showAlert(error.message);
        }

        if (!error) {
            const { isEmpty: currentAccountIsEmpty } = await accountIsEmpty();

            console.log('existingSessionWasAnonymous', existingSessionWasAnonymous, existingSessionAccountId);
            console.log('currentAccountIsEmpty', currentAccountIsEmpty);

            if (existingSessionWasAnonymous &&
                existingSessionAccountId &&
                existingSessionAccessToken &&
                existingAccountProfileId &&
                existingAccountFollowedPlayerCount > 0 &&
                currentAccountIsEmpty
            ) {
                await supabaseClient.auth.updateUser({
                    data: {
                        existingSessionAccountId,
                    }
                });
                showAlert(
                    getTranslation('login.dialog.title.migrate'),
                    getTranslation('login.dialog.message.migrate'),
                    [
                        {
                            text: getTranslation('login.dialog.cancel'),
                            style: 'cancel',
                            onPress: async () => {
                                setLoading(false);
                                await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' });
                            },
                        },
                        {
                            text: getTranslation('login.dialog.confirm'),
                            onPress: async () => {
                                await migrateFromAnonymous(existingSessionAccountId, existingSessionAccessToken);
                                setLoading(false);
                                await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' });
                            },
                        },
                    ],
                    { cancelable: false }
                );
            } else {
                setLoading(false);
                await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' });
            }
        }
    }

    async function signUpWithEmail() {
        setLoading(true)

        let { data, error } = await supabaseClient.auth.updateUser(
            {
                email,
                password,
            },
            {
                emailRedirectTo: 'https://www.aoe2companion.com',
            }
        );

        console.log('signup data', data)
        console.log('signup error', error)

        if (error?.message?.includes('New password should be different from the old password.')) {
            const result = await supabaseClient.auth.updateUser(
                {
                    email,
                },
                {
                    emailRedirectTo: 'https://www.aoe2companion.com',
                }
            );
            data = result.data;
            error = result.error;
        }

        if (error) {
            showAlert(error.message)
        } else {
            showAlert(getTranslation('login.inboxverification'))
        }

        setLoading(false)

        console.log('signup invalidating queries')
        await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' })
    }

    return (
        <View style={styles.container}>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                {/*<MyText>Email</MyText>*/}
                <Field
                    placeholder={getTranslation('login.placeholder.email')}
                    type="email"
                    autoFocus={!__DEV__}
                    onChangeText={text => setEmail(text.trim())}
                    value={email}
                />
            </View>
            <View style={styles.verticallySpaced}>
                {/*<MyText>Password</MyText>*/}
                <Field
                    placeholder={getTranslation('login.placeholder.password')}
                    type="password"
                    onChangeText={setPassword}
                    value={password}
                />
            </View>

            <View className="flex-row justify-end">
                <TouchableOpacity className="p-2" onPress={() => forgotPassword()}>
                    <Text variant="body">{getTranslation('login.forgotpassword')}</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Button align="center"
                        disabled={loading}
                        onPress={() => signInWithEmail()}
                >
                    {getTranslation('login.signin')}
                </Button>
            </View>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Button align="center"
                        disabled={loading}
                        onPress={() => signUpWithEmail()}
                >
                    {getTranslation('login.createnewaccount')}
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
})