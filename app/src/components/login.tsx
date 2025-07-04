import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, TouchableOpacity } from 'react-native';
import { useTranslation } from '@app/helper/translate';
import { supabaseClient } from '../../../data/src/helper/supabase';
import { Button } from '@app/components/button';
import { Field } from '@app/components/field';
import { useQueryClient } from '@tanstack/react-query';
import { useAccount } from '@app/queries/all';
import { Text } from '@app/components/text';

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
    const [email, setEmail] = useState('dennis.keil10+12@gmail.com')
    const [password, setPassword] = useState('test1234')
    const [loading, setLoading] = useState(false)
    const getTranslation = useTranslation();
    const account = useAccount();
    const queryClient = useQueryClient();

    // console.log('LOGIN account', account.data);

    async function resetPassword() {
        setLoading(true)

        const { error } = await supabaseClient.auth.resetPasswordForEmail(
            email,
            {
                redirectTo: 'https://www.aoe2companion.com',
            }
        );

        if (error) {
            Alert.alert(error.message)
        } else {
            Alert.alert(getTranslation('login.inboxreset'))
        }

        setLoading(false)

        await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' })
    }

    async function forgotPassword() {
        Alert.alert(
            getTranslation('login.dialog.title.resetpassword'),
            getTranslation('login.dialog.message.resetpassword', { email }),
            [
                { text: getTranslation('login.dialog.cancel'), style: 'cancel' },
                { text: getTranslation('login.dialog.confirm'), onPress: resetPassword },
            ],
            { cancelable: false }
        );
    }

    async function signInWithEmail() {
        setLoading(true)
        const { error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        setLoading(false)

        await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' })
    }

    async function signUpWithEmail() {
        setLoading(true)

        const { data, error } = await supabaseClient.auth.updateUser(
            {
                email,
                password,
            },
            {
                emailRedirectTo: 'https://www.aoe2companion.com',
            }
        );

        console.log('data', data)
        console.log('error', error)

        if (error) {
            Alert.alert(error.message)
        } else {
            Alert.alert(getTranslation('login.inboxverification'))
        }

        // const {
        //     data: { session },
        //     error,
        // } = await supabaseClient.auth.signUp({
        //     email: email,
        //     password: password,
        //     options: {
        //         data: {
        //             ...account,
        //         },
        //         emailRedirectTo: 'https://www.aoe2companion.com',
        //     }
        // })
        //
        // if (error) Alert.alert(error.message)
        // if (!session) Alert.alert('Please check your inbox for email verification!')

        setLoading(false)

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
                    onChangeText={setEmail}
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