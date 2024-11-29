import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import { MyText } from '@app/view/components/my-text';
import { createStylesheet } from '../../theming-new';
import { getTranslation } from '../../helper/translate';
import { Link, Stack } from 'expo-router';
import { ScrollView } from '@app/components/scroll-view';
import useAuth from '../../../../data/src/hooks/use-auth';
import Login from '@app/components/login';
import { getHost, makeQueryString } from '@nex/data';
import Space from '@app/view/components/space';
import { openLink } from '@app/helper/url';
import { useTheme } from '@app/theming';
import { appVariants } from '@app/styles';
import { useAccount } from '@app/app/_layout';

function getPatreonLoginUrl() {
    const queryString = new URLSearchParams({
        response_type: 'code',
        client_id: 'jsn5ztplpiU4BZ1PxAzOnK5ZyXti69KhEFGQpZSNCt2ahACRi1LMo6kMKmxLFVmn',
        redirect_uri: `${getHost('aoe2companion')}auth/link/patreon`,
        scope: 'identity identity.memberships',
        allow_signup: 'false',
    }).toString();

    return `https://www.patreon.com/oauth2/authorize?${queryString}`;
}

function getSteamLoginUrl() {
    // let realm = getHost('aoe2companion');
    // let returnUrl = `${getHost('aoe2companion')}auth/link/steam`;
    let realm = `https://www.aoe2companion.com`;
    let returnUrl = `https://www.aoe2companion.com/auth/link/steam`;

    let match = realm.match(/^(https?:\/\/[^:/]+)/);
    if (!match) {
        throw new Error(`"${realm}" does not appear to be a valid realm`);
    }
    realm = match[1].toLowerCase();

    let queryString = makeQueryString({
        'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.mode': 'checkid_setup',
        'openid.ns': 'http://specs.openid.net/auth/2.0',
        'openid.realm': realm,
        'openid.return_to': returnUrl,
    });

    return 'https://steamcommunity.com/openid/login?' + queryString;
}

export default function AccountPage() {
    const styles = useStyles();
    const appStyles = useTheme(appVariants);
    // const [state, setState] = useState('');

    const user = useAuth();
    const account = useAccount();

    console.log('user', user);
    console.log('account', account);

    return (
        <ScrollView contentContainerStyle="min-h-full items-center p-5">
            <Stack.Screen options={{ title: getTranslation('account.title') }} />

            <MyText style={styles.title}>{Constants.expoConfig?.name || Constants.expoConfig2?.extra?.expoClient?.name}</MyText>

            {!user && <Login />}

            {user && (
                <View>
                    <MyText style={styles.content}>{user.email}</MyText>

                    <Space />

                    <TouchableOpacity onPress={() => openLink(getPatreonLoginUrl())}>
                        <MyText style={appStyles.link}>Link Patreon</MyText>
                    </TouchableOpacity>

                    <Space />

                    {
                        account.data?.account.steamId &&
                        <>
                            <MyText style={styles.heading}>Steam ID: {account.data.account.steamId}</MyText>
                            <TouchableOpacity onPress={() => openLink(getSteamLoginUrl())}>
                                <MyText style={appStyles.link}>Unlink Steam</MyText>
                            </TouchableOpacity>
                        </>
                    }
                    {
                        !account.data?.account.steamId &&
                        <TouchableOpacity onPress={() => openLink(getSteamLoginUrl())}>
                            <MyText style={appStyles.link}>Link Steam</MyText>
                        </TouchableOpacity>
                    }

                    <Space />
                    <Space />
                    <Link href={'https://www.aoe2companion.com/auth/link/steam'}>TEST</Link>

                    {/*<a href={getPatreonLoginUrl()}>Link Patreon</a>*/}
                    {/*<Space />*/}
                    {/*<a href={getSteamLoginUrl()}>Link Steam</a>*/}
                </View>
            )}
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
