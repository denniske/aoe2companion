import React, { useEffect, useState } from 'react';
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
import useAuth from '@/data/src/hooks/use-auth';

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabaseClient.auth.startAutoRefresh();
    } else {
        supabaseClient.auth.stopAutoRefresh();
    }
});

export default function Login({ onComplete }: { onComplete?: () => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLocalLoading] = useState(false);
    const getTranslation = useTranslation();
    const account = useAccount();
    const queryClient = useQueryClient();
    const user = useAuth();

    const setLoading = (value: boolean) => {
        setLocalLoading(value);

        if (!value) {
            onComplete?.();
        }
    };

    // console.log('LOGIN user', user);

    async function resetPassword() {
        setLoading(true);

        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://www.aoe2companion.com',
        });

        if (error) {
            showAlert(error.message);
        } else {
            showAlert(getTranslation('login.inboxreset'));
        }

        setLoading(false);

        await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' });
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
        const { error, result } = await accountMigrateFromAnonymous(existingSessionAccountId, existingSessionAccessToken);
        if (result === 'success') {
            showAlert(getTranslation('login.dialog.title.migrate.success'), getTranslation('login.dialog.message.migrate.success'));
        }
        if (error) {
            showAlert(error);
        }
    }

    async function signInWithEmail() {
        setLoading(true);

        const { data } = await supabaseClient.auth.getSession();

        const existingSessionWasAnonymous = data.session?.user?.is_anonymous;
        const existingSessionAccountId = data.session?.user.id;
        const existingSessionAccessToken = data.session?.access_token;
        const existingAccountProfileId = account.data?.profileId;
        const existingAccountFollowedPlayerCount = account.data?.followedPlayers.length ?? 0;

        const { error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            setLocalLoading(false);
            showAlert(error.message);
        }

        if (!error) {
            const { isEmpty: currentAccountIsEmpty } = await accountIsEmpty();

            console.log('existingSessionWasAnonymous', existingSessionWasAnonymous, existingSessionAccountId);
            console.log('currentAccountIsEmpty', currentAccountIsEmpty);

            if (
                existingSessionWasAnonymous &&
                existingSessionAccountId &&
                existingSessionAccessToken &&
                existingAccountProfileId &&
                existingAccountFollowedPlayerCount > 0 &&
                currentAccountIsEmpty
            ) {
                await supabaseClient.auth.updateUser({
                    data: {
                        existingSessionAccountId,
                    },
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
        setLoading(true);

        const {
            data: { session },
        } = await supabaseClient.auth.getSession();

        let { data, error } = session
            ? await supabaseClient.auth.updateUser(
                  {
                      email,
                      password,
                  },
                  {
                      emailRedirectTo: 'https://www.aoe2companion.com',
                  }
              )
            : await supabaseClient.auth.signUp({
                  email,
                  password,
                  options: { emailRedirectTo: 'https://www.aoe2companion.com' },
              });

        console.log('signup data', data);
        console.log('signup error', error);

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
            showAlert(error.message);
        } else {
            showAlert(getTranslation('login.inboxverification'));

            setLoading(false);
            await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' });
        }
    }

    return (
        <View className="gap-3">
            <Field
                type="email"
                onChangeText={(text) => setEmail(text.trim())}
                value={email}
                placeholder={getTranslation('login.placeholder.email')}
            />

            <View className="gap-1">
                <Field type="password" onChangeText={setPassword} value={password} placeholder={getTranslation('login.placeholder.password')} />

                <View className="flex-row justify-end">
                    <TouchableOpacity className="p-2" onPress={() => forgotPassword()}>
                        <Text variant="body">{getTranslation('login.forgotpassword')}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="gap-4 max-w-sm w-full mx-auto">
                <Button align="center" disabled={loading} onPress={() => signInWithEmail()}>
                    {getTranslation('login.signin')}
                </Button>
                {!user || user.is_anonymous ? (
                    <Button align="center" disabled={loading} onPress={() => signUpWithEmail()}>
                        {getTranslation('login.createnewaccount')}
                    </Button>
                ) : null}
            </View>
        </View>
    );
}
