import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState } from 'react-native'
import { supabaseClient } from '../../../data/src/helper/supabase';
import { Button } from 'react-native-paper';
import { MyText } from '@app/view/components/my-text';

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
    const [email, setEmail] = useState('dennis.keil10+1@gmail.com')
    const [password, setPassword] = useState('123abc')
    const [loading, setLoading] = useState(false)

    async function signInWithEmail() {
        setLoading(true)
        const { error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        setLoading(false)
    }

    async function signUpWithEmail() {
        setLoading(true)
        const {
            data: { session },
            error,
        } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        if (!session) Alert.alert('Please check your inbox for email verification!')
        setLoading(false)
    }

    return (
        <View style={styles.container}>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                {/*leftIcon={{ type: 'font-awesome', name: 'envelope' }}*/}
                <MyText>Email</MyText>
                <input
                    onChange={(text) => setEmail(text.target.value)}
                    value={email}
                    placeholder="email@address.com"
                    autoCapitalize={'none'}
                />
            </View>
            <View style={styles.verticallySpaced}>
                {/*leftIcon={{ type: 'font-awesome', name: 'lock' }}*/}
                <MyText>Password</MyText>
                <input
                    onChange={(text) => setPassword(text.target.value)}
                    value={password}
                    type={'password'}
                    placeholder="Password"
                    autoCapitalize={'none'}
                />
            </View>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Button disabled={loading} onPress={() => signInWithEmail()} >Sign in</Button>
            </View>
            <View style={styles.verticallySpaced}>
                <Button disabled={loading} onPress={() => signUpWithEmail()} >Sign up</Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
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