import { Field } from '@app/components/field';
import { FlatList } from '@app/components/flat-list';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { Text } from '@app/components/text';
import { Civ, civs, getCivNameById, getCivTeamBonus, orderCivs, parseCivDescription } from '@nex/data';
import { appConfig } from '@nex/dataset';
import { Image } from '@/src/components/uniwind/image';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getCivIconLocal } from '../../../helper/civs';
import { useTranslation } from '@app/helper/translate';
import { useAoe4CivData } from '@app/queries/all';
import cn from 'classnames';
import { containerClassName } from '@app/styles';
import { useBreakpoints } from '@app/hooks/use-breakpoints';

type Mutable<Type> = {
    -readonly [Key in keyof Type]: Type[Key];
};

function makeMutable<T>(a: T) {
    return a as Mutable<T>;
}

export default function CivList() {
    const getTranslation = useTranslation();
    const [text, setText] = useState('');
    const [list, setList] = useState(makeMutable(civs) as Civ[]);
    const { isMedium } = useBreakpoints();

    const refresh = () => {
        setList(civs.filter((civ) => getCivNameById(civ)?.toLowerCase().includes(text.toLowerCase())));
    };

    useEffect(() => {
        refresh();
    }, [text]);

    const aoe4CivInfo = useAoe4CivData();

    const renderItem = (civ: Civ, index: number) => (
        <TouchableOpacity key={civ} onPress={() => router.push(`/explore/civilizations/${civ}`)}>
            <View className={`flex-row items-center py-1.5 -mx-4 px-4 ${text && index === 0 ? 'bg-gold-100 dark:bg-blue-900' : ''}`}>
                <Image className={`${appConfig.game === 'aoe2' ? 'w-8' : 'w-14'} h-8`} source={getCivIconLocal(civ)} />
                <View className="flex-1 ml-2.5">
                    <Text variant="label">{getCivNameById(civ)}</Text>
                    <Text variant="body-sm" color="subtle" numberOfLines={1}>
                        {appConfig.game === 'aoe2' ? getCivTeamBonus(civ) : aoe4CivInfo?.[civ]?.classes}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderItemRow = (civ: Civ, index: number) => {
        const desc = parseCivDescription(civ);
        const strength = appConfig.game === 'aoe2' ? desc?.type : aoe4CivInfo?.[civ]?.classes;
        const teamBonus = appConfig.game === 'aoe2' ? desc?.teamBonus : null;

        return (
            <TouchableOpacity key={civ} onPress={() => router.push(`/explore/civilizations/${civ}`)}>
                <View className={`flex-row items-center py-1.5 -mx-4 px-4 gap-2 ${text && index === 0 ? 'bg-gold-100 dark:bg-blue-900' : ''}`}>
                    <Image className={cn('h-12', appConfig.game === 'aoe2' ? 'w-12' : 'w-20')} source={getCivIconLocal(civ)} />
                    <View className={cn('ml-2.5 flex-row justify-between w-32', appConfig.game !== 'aoe2' && 'w-auto flex-1')}>
                        <Text variant="header-sm">{getCivNameById(civ)}</Text>
                    </View>

                    <Text variant="body" numberOfLines={1} className={cn(appConfig.game === 'aoe2' && "flex-1")}>
                        {strength}
                    </Text>
                    <Text variant="body" color="subtle" numberOfLines={1}>
                        {teamBonus}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <KeyboardAvoidingView>
            <View className="flex-1">
                <Stack.Screen options={{ title: getTranslation('civs.title') }} />

                {appConfig.game === 'aoe2' && (
                    <View className={cn('pt-4', containerClassName)}>
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
                    contentContainerClassName="p-4"
                    keyboardShouldPersistTaps="always"
                    data={orderCivs(list.filter((c) => c !== 'Indians'))}
                    renderItem={({ item, index }) => (isMedium ? renderItemRow(item, index) : renderItem(item, index))}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={isMedium ? () => <View className="h-px bg-border" /> : null}
                />
            </View>
        </KeyboardAvoidingView>
    );
}
