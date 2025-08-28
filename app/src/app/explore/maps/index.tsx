import { Field } from '@app/components/field';
import { FlatList } from '@app/components/flat-list';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { Text } from '@app/components/text';
import { civs } from '@nex/data';
import { appConfig } from '@nex/dataset';
import { Image } from 'expo-image';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTranslation } from '@app/helper/translate';
import { useMaps } from '@app/queries/all';
import { IMap } from '@app/api/helper/api.types';
import { compact, orderBy } from 'lodash';

export default function MapsIndex() {
    const getTranslation = useTranslation();
    const [text, setText] = useState('');
    const [list, setList] = useState<IMap[]>([]);
    const { data: maps } = useMaps();

    useEffect(() => {
        const filtered = compact(maps).filter((map) => map.mapName?.toLowerCase()?.includes(text.toLowerCase()));
        const ordered = orderBy(filtered, (map) => map.mapName);
        setList(ordered);
    }, [maps, text]);

    const renderItem = (map: IMap, index: number) => (
        <TouchableOpacity key={map.mapId} onPress={() => router.push(`/explore/maps/${map.mapId}`)}>
            <View className={`flex-row items-center py-1.5 -mx-4 px-4 ${text && index === 0 ? 'bg-gold-100 dark:bg-blue-900' : ''}`}>
                <Image className={`${appConfig.game === 'aoe2de' ? 'w-8' : 'w-14'} h-8`} source={{ uri: map.imageUrl }} />
                <View className="flex-1 ml-2.5">
                    <Text variant="label">{map.mapName}</Text>
                    <Text variant="body-sm" color="subtle" numberOfLines={1}>
                        {map.description}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView>
            <View className="flex-1">
                <Stack.Screen options={{ title: getTranslation('maps.title') }} />

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
                                    router.navigate(`/explore/maps/${topResult}`);
                                }
                            }}
                        />
                    </View>
                )}

                <FlatList
                    contentContainerStyle="p-4"
                    keyboardShouldPersistTaps="always"
                    data={list}
                    renderItem={({ item, index }) => renderItem(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </KeyboardAvoidingView>
    );
}
