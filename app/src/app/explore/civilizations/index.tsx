import { Field } from '@app/components/field';
import { FlatList } from '@app/components/flat-list';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { Text } from '@app/components/text';
import { civDataAbbasidDynasty } from '@app4/data/abbasiddynasty';
import { civDataAyyubids } from '@app4/data/ayyubids';
import { civDataByzantines } from '@app4/data/byzantines';
import { civDataChinese } from '@app4/data/chinese';
import { civDataDelhiSultanate } from '@app4/data/delhisultanate';
import { civDataEnglish } from '@app4/data/english';
import { civDataFrench } from '@app4/data/french';
import { civDataHolyRomanEmpire } from '@app4/data/holyromanempire';
import { civDataJapanese } from '@app4/data/japanese';
import { civDataJeanneDArc } from '@app4/data/jeannedarc';
import { civDataMalians } from '@app4/data/malians';
import { civDataMongols } from '@app4/data/mongols';
import { civDataOrderOfTheDragon } from '@app4/data/orderofthedragon';
import { civDataOttomans } from '@app4/data/ottomans';
import { civDataRus } from '@app4/data/rus';
import { civDataZhuXiSLegacy } from '@app4/data/zhuxislegacy';
import { Civ, civs, getCivNameById, getCivTeamBonus, orderCivs } from '@nex/data';
import { getCivStrategies } from '@nex/data4';
import { appConfig } from '@nex/dataset';
import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { getCivIconLocal } from '../../../helper/civs';
import { getTranslation } from '../../../helper/translate';

type Mutable<Type> = {
    -readonly [Key in keyof Type]: Type[Key];
};

function makeMutable<T>(a: T) {
    return a as Mutable<T>;
}

const aoe4CivInfo = {
    AbbasidDynasty: civDataAbbasidDynasty,
    Chinese: civDataChinese,
    DelhiSultanate: civDataDelhiSultanate,
    English: civDataEnglish,
    French: civDataFrench,
    HolyRomanEmpire: civDataHolyRomanEmpire,
    Malians: civDataMalians,
    Mongols: civDataMongols,
    Ottomans: civDataOttomans,
    Rus: civDataRus,
    Byzantines: civDataByzantines,
    Japanese: civDataJapanese,
    JeanneDArc: civDataJeanneDArc,
    Ayyubids: civDataAyyubids,
    ZhuXiSLegacy: civDataZhuXiSLegacy,
    OrderOfTheDragon: civDataOrderOfTheDragon,
};

export default function CivList() {
    const [text, setText] = useState('');
    const [list, setList] = useState(makeMutable(civs) as Civ[]);

    const refresh = () => {
        setList(civs.filter((civ) => getCivNameById(civ)?.toLowerCase().includes(text.toLowerCase())));
    };

    useEffect(() => {
        refresh();
    }, [text]);

    const renderItem = (civ: Civ, index: number) => (
        <TouchableOpacity key={civ} onPress={() => router.push(`/explore/civilizations/${civ}`)}>
            <View className={`flex-row items-center py-1.5 -mx-4 px-4 ${text && index === 0 ? 'bg-gold-100 dark:bg-blue-900' : ''}`}>
                <Image className={`${appConfig.game === 'aoe2de' ? 'w-8' : 'w-14'} h-8`} source={getCivIconLocal(civ)} />
                <View className="flex-1 ml-2.5">
                    <Text variant="label">{getCivNameById(civ)}</Text>
                    <Text variant="body-sm" color="subtle" numberOfLines={1}>
                        {appConfig.game === 'aoe2de' ? getCivTeamBonus(civ) : getCivStrategies(aoe4CivInfo, civ)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView>
            <View className="flex-1">
                <Stack.Screen options={{ title: getTranslation('civs.title') }} />

                {appConfig.game === 'aoe2de' && (
                    <View className="pt-4 px-4">
                        <Field
                            type="search"
                            placeholder={getTranslation('unit.search.placeholder')}
                            onChangeText={(text) => setText(text)}
                            value={text}
                            onSubmitEditing={() => {
                                const topResult = list[0];
                                if (topResult) {
                                    router.navigate(`/explore/civilizations/${topResult}`);
                                }
                            }}
                        />
                    </View>
                )}

                <FlatList
                    contentContainerStyle="p-4"
                    keyboardShouldPersistTaps="always"
                    data={orderCivs(list.filter((c) => c !== 'Indians'))}
                    renderItem={({ item, index }) => renderItem(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </KeyboardAvoidingView>
    );
}
