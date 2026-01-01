import React from 'react';
import { Stack } from 'expo-router';
import { useTranslation } from '@app/helper/translate';
import { View } from 'react-native';
import { ScrollView } from '@app/components/scroll-view';
import { appConfig } from '@nex/dataset';
import { Link } from '@app/components/link';
import { Text } from '@app/components/text';

export default function ApiPage() {
    const getTranslation = useTranslation();

    return (
        <View>
            <Stack.Screen options={{ title: getTranslation('api.title') }} />
            <ScrollView contentContainerClassName='px-4 py-6'>
                <View className="text-lg my-6">
                    Usage Notes
                </View>

                <Text className="text-base">
                    The API is quite stable but there might be changes.
                </Text>

                <Text className="text-base">
                    When making calls to the API provide a user agent header set to you app / website / bot name.
                </Text>

                <Text className="text-base">
                    Please make responsible use of our API – don't make extraneous calls or try to extract all data in bulk through crawling the API.
                </Text>

                <Text className="text-base">
                    For example how to use the API just open the developer tools F12 on chrome while browsing <Link target="_blank" href={`https://${appConfig.hostAoeCompanion}`}>{appConfig.hostAoeCompanion}</Link>
                </Text>

                <Text className="text-base">
                    If you have a specific usecase in mind reach out on <Link target="_blank" href="https://discord.gg/gCunWKx">Discord</Link>.
                </Text>


                <View className="text-lg font-bold my-3">
                    Player Profile
                </View>

                <View className="ml-2 space-y-2">
                    <View className="">
                        <Text className="text-base">
                            GET <Link target="_blank" href="https://data.aoe2companion.com/api/profiles/199325">/api/profiles/199325</Link>
                        </Text>
                        {/*<View className="text-sm">*/}
                        {/*    Leaderboard ID (Unranked=0, 1v1 Deathmatch=1, Team Deathmatch=2, 1v1 Random Map=3, Team Random Map=4, 1v1 Empire Wars=13, Team Empire Wars=14)*/}
                        {/*</View>*/}
                    </View>
                    {/*<View className="">*/}
                    {/*    <View className="text-base">*/}
                    {/*        language (Optional, defaults to en)*/}
                    {/*    </View>*/}
                    {/*    <View className="text-sm">*/}
                    {/*        ms (Bahasa Melayu)*/}
                    {/*        de (Deutsch)*/}
                    {/*        en (English)*/}
                    {/*        es (Español)*/}
                    {/*        es-mx (Español (Mexico))*/}
                    {/*        fr (Français)*/}
                    {/*        it (Italiano)*/}
                    {/*        pt (Português-Brasil)*/}
                    {/*        ru (Pусский)*/}
                    {/*        vi (Tiếng Việ)*/}
                    {/*        tr (Türkçe)*/}
                    {/*        hi (हिन्दी)*/}
                    {/*        ja (日本語)*/}
                    {/*        ko (한국어)*/}
                    {/*        zh-hans (简体中文)*/}
                    {/*        zh-hant (繁體字)*/}
                    {/*    </View>*/}
                    {/*</View>*/}
                </View>



                <View className="text-lg my-6">
                    Nightbot
                </View>

                <View className="text-lg font-bold my-3">
                    Rank
                </View>
                <View className="text-base">
                    Request rank details about a player
                </View>

                <View className="text-base font-bold my-3">
                    Request Parameters
                </View>
                <View className="ml-2 space-y-2">
                    <View className="">
                        <View className="text-base">
                            leaderboard_id (Optional, defaults to 3)
                        </View>
                        <View className="text-sm">
                            Leaderboard ID (Unranked=0, 1v1 Deathmatch=1, Team Deathmatch=2, 1v1 Random Map=3, Team Random Map=4, 1v1 Empire Wars=13, Team Empire Wars=14)
                        </View>
                    </View>
                    <View className="">
                        <View className="text-base">
                            flag (Optional, defaults to true)
                        </View>
                        <View className="text-sm">
                            Show player flag
                        </View>
                    </View>
                    <View className="">
                        <View className="text-base">
                            search (search, steam_id or profile_id required)
                        </View>
                        <View className="text-sm">
                            Name Search, returns the highest rated player
                        </View>
                    </View>
                    <View className="">
                        <View className="text-base">
                            steam_id (search, steam_id or profile_id required)
                        </View>
                        <View className="text-sm">
                            steamID64 (ex: 76561199003184910)
                        </View>
                    </View>
                    <View className="">
                        <View className="text-base">
                            profile_id (search, steam_id or profile_id required)
                        </View>
                        <View className="text-sm">
                            Profile ID (ex: 459658)
                        </View>
                    </View>
                </View>


                <View className="text-lg my-3">
                    Example Command
                </View>
                <View className="ml-2 space-y-2">
                    <View className="">
                        <View className="text-sm">
                            !addcom !rank $(urlfetch https://data.{appConfig.hostAoeCompanion}/api/nightbot/rank?leaderboard_id=3&search=$(querystring)&steam_id=76561199003184910&flag=false)
                        </View>
                    </View>
                </View>

                <View className="text-lg my-3">
                    Example Url
                </View>
                <View className="ml-2 space-y-2">
                    <View className="">
                        <View className="text-sm">
                            <Link target="_blank" href="https://data.aoe2companion.com/api/nightbot/rank?leaderboard_id=3&search=viper&steam_id=76561199003184910&flag=false">https://data.aoe2companion.com/api/nightbot/rank?leaderboard_id=3&search=viper&steam_id=76561199003184910&flag=false</Link>
                        </View>
                    </View>
                </View>

                <View className="text-lg my-3">
                    Example Responses
                </View>
                <View className="ml-2 space-y-2">
                    <View className="">
                        <View className="text-sm">
                            twitchuser: !rank
                        </View>
                        <View className="text-sm">
                            Nightbot: Hoang (1799) Rank #44, has played 1181 games with a 59% winrate, -1 streak, and 20 drops
                        </View>
                    </View>
                    <View className="">
                        <View className="text-sm">
                            twitchuser: !rank Hera
                        </View>
                        <View className="text-sm">
                            Nightbot: Hera (2118) Rank #1, has played 659 games with a 71% winrate, +6 streak, and 3 drops
                        </View>
                    </View>
                </View>


                <View className="text-lg font-bold my-3">
                    Match
                </View>
                <View className="text-base">
                    Request details about the current or last match
                </View>

                <View className="text-base font-bold my-3">
                    Request Parameters
                </View>
                <View className="ml-2 space-y-2">
                    <View className="">
                        <View className="text-base">
                            leaderboard_id (Optional)
                        </View>
                        <View className="text-sm">
                            Leaderboard ID can be used to restrict player result to a leaderboard (Unranked=0, 1v1 Deathmatch=1, Team Deathmatch=2, 1v1 Random Map=3, Team Random Map=4, 1v1 Empire Wars=13, Team Empire Wars=14)
                        </View>
                    </View>
                    <View className="">
                        <View className="text-base">
                            color (Optional, defaults to true)
                        </View>
                        <View className="text-sm">
                            Show player colors
                        </View>
                    </View>
                    <View className="">
                        <View className="text-base">
                            search (search, steam_id or profile_id required)
                        </View>
                        <View className="text-sm">
                            Name Search, returns the highest rated player
                        </View>
                    </View>
                    <View className="">
                        <View className="text-base">
                            steam_id (search, steam_id or profile_id required)
                        </View>
                        <View className="text-sm">
                            steamID64 (ex: 76561199003184910)
                        </View>
                    </View>
                    <View className="">
                        <View className="text-base">
                            profile_id (search, steam_id or profile_id required)
                        </View>
                        <View className="text-sm">
                            Profile ID (ex: 459658)
                        </View>
                    </View>
                </View>


                <View className="text-lg my-3">
                    Example Command
                </View>
                <View className="ml-2 space-y-2">
                    <View className="">
                        <View className="text-sm">
                            !addcom !match $(urlfetch https://data.{appConfig.hostAoeCompanion}/api/nightbot/match?search=$(querystring)&steam_id=76561199003184910&color=false&flag=false)
                        </View>
                    </View>
                </View>


                <View className="text-lg my-3">
                    Example Url
                </View>
                <View className="ml-2 space-y-2">
                    <View className="">
                        <View className="text-sm">
                            <Link target="_blank" href="https://data.aoe2companion.com/api/nightbot/match?search=viper&steam_id=76561199003184910&color=false&flag=false">https://data.aoe2companion.com/api/nightbot/match?search=viper&steam_id=76561199003184910&color=false&flag=false</Link>
                        </View>
                    </View>
                </View>

                <View className="text-lg my-3">
                    Example Responses
                </View>
                <View className="ml-2 space-y-2">
                    <View className="">
                        <View className="text-sm">
                            twitchuser: !match
                        </View>
                        <View className="text-sm">
                            Nightbot: Hoang (1815) as Celts -VS- DracKeN (1820) as Celts playing on Black Forest
                        </View>
                    </View>
                    <View className="">
                        <View className="text-sm">
                            twitchuser: !match Hera
                        </View>
                        <View className="text-sm">
                            Nightbot: Hera (2112) as Mayans -VS- ACCM (1960) as Aztecs playing on Gold Rush
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
