import { Field } from '@app/components/field';
import { FlatList } from '@app/components/flat-list';
import { Text } from '@app/components/text';
import { Civ, civs, getCivNameById, getCivTeamBonus, orderCivs } from '@nex/data';
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

export default function CivList() {
    const [text, setText] = useState('');
    const [list, setList] = useState(makeMutable(civs) as Civ[]);

    const refresh = () => {
        setList(civs.filter((civ) => getCivNameById(civ)?.toLowerCase().includes(text.toLowerCase())));
    };

    useEffect(() => {
        refresh();
    }, [text]);

    const renderItem = (civ: Civ) => (
        <TouchableOpacity key={civ} onPress={() => router.push(`/explore/civilizations/${civ}`)}>
            <View className="flex-row items-center py-1.5">
                <Image className="w-8 h-8" source={getCivIconLocal(civ)} />
                <View className="flex-1 ml-2.5">
                    <Text variant="label">{getCivNameById(civ)}</Text>
                    <Text variant="body-sm" color="subtle" numberOfLines={1}>
                        {getCivTeamBonus(civ) ?? ''}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1">
            <Stack.Screen options={{ title: getTranslation('civs.title') }} />

            {appConfig.game === 'aoe2de' && (
                <View className="pt-4 px-4">
                    <Field placeholder={getTranslation('unit.search.placeholder')} onChangeText={(text) => setText(text)} value={text} />
                </View>
            )}

            <FlatList
                contentContainerStyle="p-4"
                keyboardShouldPersistTaps="always"
                data={orderCivs(list.filter((c) => c !== 'Indians'))}
                renderItem={({ item, index }) => renderItem(item)}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}
