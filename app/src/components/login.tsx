import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState } from 'react-native'
import { supabaseClient } from '../../../data/src/helper/supabase';
import { Button } from 'react-native-paper';
import { MyText } from '@app/view/components/my-text';
import { Field } from '@app/components/field';
import { useQueryClient } from '@tanstack/react-query';
import { useAccount } from '@app/queries/all';
import { usePaperTheme } from '@app/theming';

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
    const account = useAccount();
    const queryClient = useQueryClient();

    const paperTheme = usePaperTheme();

    // console.log('LOGIN account', account.data);

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
            Alert.alert('Please check your inbox for email verification!')
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
                {/*leftIcon={{ type: 'font-awesome', name: 'envelope' }}*/}
                {/*<MyText>Email</MyText>*/}

                <Field
                    placeholder="email@address.com"
                    type="default"
                    // autoFocus={true}
                    onChangeText={setEmail}
                    value={email}
                />
            </View>
            <View style={styles.verticallySpaced}>
                {/*leftIcon={{ type: 'font-awesome', name: 'lock' }}*/}
                {/*<MyText>Password</MyText>*/}
                <Field
                    placeholder="Password"
                    type="password"
                    onChangeText={setPassword}
                    value={password}
                />
            </View>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Button disabled={loading} onPress={() => signInWithEmail()}
                        mode="contained"
                        uppercase={false}
                        dark={true}
                        buttonColor={paperTheme.colors.primary}
                >
                    Sign in
                </Button>
            </View>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Button disabled={loading} onPress={() => signUpWithEmail()}
                        mode="contained"
                        uppercase={false}
                        dark={true}
                        buttonColor={paperTheme.colors.primary}
                >
                    Sign up
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