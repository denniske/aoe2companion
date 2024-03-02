import { Button } from '@app/components/button';
import { Card } from '@app/components/card';
import { FlatList, FlatListRef, FlatListProps } from '@app/components/flat-list';
import { Icon } from '@app/components/icon';
import { Text } from '@app/components/text';
import { useSelector } from '@app/redux/reducer';
import { isVerifiedPlayer } from '@nex/data';
import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { CountryImage } from './country-image';
import { useCavy } from '../testing/tester';

export interface IPlayerListPlayer {
    country: string;
    games: number;
    name: string;
    profileId: number;
    steamId?: string;
}

interface IPlayerProps<PlayerType extends IPlayerListPlayer> {
    player: PlayerType | 'select' | 'follow';
    selectedUser?: (user: any) => void;
    actionText?: string;
    action?: (player: PlayerType) => React.ReactNode;
    variant?: 'vertical' | 'horizontal';
}

function Player<PlayerType extends IPlayerListPlayer>({ player, selectedUser, actionText, action, variant }: IPlayerProps<PlayerType>) {
    const generateTestHook = useCavy();
    const auth = useSelector((state) => state.auth);

    if (player === 'select') {
        return (
            <Card
                direction="vertical"
                className="items-center justify-center gap-1 py-2 px-2.5 w-20"
                onPress={() => router.navigate('/matches/users/select')}
            >
                <Icon icon="user" color="brand" size={24} />
                <View className="flex-row gap-1 items-center">
                    <Text numberOfLines={1} variant="body-sm">
                        Find Me
                    </Text>
                </View>
            </Card>
        );
    }

    if (player === 'follow') {
        return (
            <Card
                direction="vertical"
                className="items-center justify-center gap-1 py-2 px-2.5 w-20"
                onPress={() => router.navigate('/matches/users/follow')}
            >
                <Icon icon="plus" color="brand" size={24} />
                <View className="flex-row gap-1 items-center">
                    <Text numberOfLines={1} variant="body-sm">
                        Add Player
                    </Text>
                </View>
            </Card>
        );
    }

    const isMe = player.profileId === auth?.profileId;

    const onSelect = async () => {
        selectedUser!({
            profileId: player.profileId,
            name: player.name,
        });
    };

    if (variant === 'horizontal') {
        return (
            <Card direction="vertical" className="items-center justify-center gap-0 pt-1 pb-2 px-2.5 w-20" onPress={onSelect}>
                <CountryImage style={{ textAlign: 'center', fontSize: 24 }} country={player.country} />
                <View className="flex-row gap-1 items-center">
                    <Text numberOfLines={1} variant="body-sm">
                        {player.name}
                    </Text>
                    {isMe && <Icon color="brand" icon="user" size={12} />}
                    {!isMe && player.profileId && isVerifiedPlayer(player.profileId) && <Icon color="brand" icon="circle-check" size={12} />}
                </View>

                <Text color="subtle" variant="body-xs" numberOfLines={1}>
                    {player.games} Games
                </Text>
            </Card>
        );
    }

    return (
        <TouchableOpacity
            className="flex-row items-center w-full gap-2"
            ref={(ref) => generateTestHook('Search.Player.' + player.profileId)({ props: { onPress: onSelect } })}
            onPress={onSelect}
        >
            <CountryImage style={{ textAlign: 'center', fontSize: 30 }} country={player.country} />
            <View>
                <View className="flex-row gap-1 items-center">
                    <Text numberOfLines={1} variant="label">
                        {player.name}
                    </Text>
                    {isMe && <Icon color="brand" icon="user" size={12} />}
                    {!isMe && player.profileId && isVerifiedPlayer(player.profileId) && <Icon color="brand" icon="circle-check" size={12} />}
                </View>
                <Text variant="body-sm" color="subtle">
                    {player.games} Games
                </Text>
            </View>
            <View className="flex-1 flex-row justify-end gap-2">
                {action && action(player)}
                {actionText && selectedUser && (
                    <Button size="small" onPress={onSelect}>
                        {actionText}
                    </Button>
                )}
            </View>
            <Icon icon="angle-right" color="brand" size={20} />
        </TouchableOpacity>
    );
}

interface ISearchProps<PlayerType extends IPlayerListPlayer> extends Omit<FlatListProps<PlayerType | 'select' | 'follow'>, 'data' | 'renderItem'> {
    list: (PlayerType | 'select' | 'follow')[];
    selectedUser?: (user: any) => void;
    actionText?: string;
    action?: (player: PlayerType) => React.ReactNode;
    variant?: 'vertical' | 'horizontal';
    flatListRef?: FlatListRef<PlayerType | 'select' | 'follow'>;
}

export default function PlayerList<PlayerType extends IPlayerListPlayer>({
    list,
    selectedUser,
    actionText,
    action,
    variant = 'vertical',
    flatListRef,
    ...props
}: ISearchProps<PlayerType>) {
    return (
        <FlatList
            ref={flatListRef}
            data={list}
            horizontal={variant === 'horizontal'}
            keyboardShouldPersistTaps="always"
            ItemSeparatorComponent={() =>
                variant === 'vertical' ? <View className="h-[1px] bg-gray-200 dark:bg-gray-800 w-full my-2.5" /> : <View className="w-2" />
            }
            contentContainerStyle="px-4"
            renderItem={({ item }) => {
                return <Player player={item} selectedUser={selectedUser} actionText={actionText} action={action} variant={variant} />;
            }}
            keyExtractor={(_item, index) => index.toString()}
            className={variant === 'horizontal' ? 'flex-none' : ''}
            {...props}
        />
    );
}
