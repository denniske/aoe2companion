import { Button } from '@app/components/button';
import { Card } from '@app/components/card';
import { FlatList, FlatListRef, FlatListProps } from '@app/components/flat-list';
import { Icon } from '@app/components/icon';
import { Skeleton, SkeletonText } from '@app/components/skeleton';
import { Text } from '@app/components/text';
import { useSelector } from '@app/redux/reducer';
import { getVerifiedPlayer, isVerifiedPlayer } from '@nex/data';
import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';

import { CountryImage } from './country-image';
import { useCavy } from '../testing/tester';
import { useAuthProfileId } from '@app/queries/all';
import { TextLoader } from '@app/view/components/loader/text-loader';

export interface IPlayerListPlayer {
    country?: string;
    games?: number;
    name?: string;
    profileId: number;
    steamId?: string;
    verified?: string;
    avatarMediumUrl?: string;
}

interface IPlayerProps<PlayerType extends IPlayerListPlayer> {
    player: PlayerType | 'select' | 'follow' | 'loading';
    selectedUser?: (user: any) => void;
    actionText?: string;
    action?: (player: PlayerType) => React.ReactNode;
    footer?: (player?: PlayerType) => React.ReactNode;
    image?: (player?: PlayerType) => React.ReactNode;
    variant?: 'vertical' | 'horizontal';
    hideIcons?: boolean;
    playerStyle?: ViewStyle;
}

function Player<PlayerType extends IPlayerListPlayer>({
    player,
    selectedUser,
    actionText,
    action,
    variant,
    footer,
    image,
    hideIcons,
    playerStyle,
}: IPlayerProps<PlayerType>) {
    const generateTestHook = useCavy();
    const authProfileId = useAuthProfileId();

    if (player === 'loading') {
        return (
            <Card direction="vertical" className="items-center justify-center gap-0 pt-1 pb-2 px-2.5 w-20" style={playerStyle}>
                <View className="w-[29px] h-[28px] items-center justify-center">
                    <Skeleton className="w-6 h-6" />
                </View>
                <TextLoader />
                {footer ? footer() : <TextLoader />}
            </Card>
        );
    }

    if (player === 'select') {
        return (
            <Card
                direction="vertical"
                className="items-center justify-center gap-1 py-2 px-2.5 w-20"
                onPress={() => router.navigate('/matches/users/select')}
                style={playerStyle}
            >
                <Icon icon="user" color="brand" size={24} />
                <View className="flex-row gap-1 items-center">
                    <Text numberOfLines={1} variant="body-sm" allowFontScaling={false}>
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
                style={playerStyle}
            >
                <Icon icon="plus" color="brand" size={24} />
                <View className="flex-row gap-1 items-center">
                    <Text numberOfLines={1} variant="body-sm" allowFontScaling={false}>
                        Add Player
                    </Text>
                </View>
            </Card>
        );
    }

    const isMe = player.profileId === authProfileId;

    const onSelect = async () => {
        selectedUser!(player);
    };

    //  w-[5.5rem]

    if (variant === 'horizontal') {
        return (
            <Card direction="vertical" className="items-center justify-center gap-1 pt-1 pb-2 px-2.5" style={playerStyle} onPress={onSelect}>
                {image ? (
                    image(player)
                ) : (
                    <Image source={{ uri: player.avatarMediumUrl }} className="w-7 h-7 rounded-full" />
                )}
                {player.name && (
                    <View className="flex-row gap-1 max-w-full items-center">
                        {isMe && !hideIcons && <Icon color="brand" icon="user" size={12} />}
                        <Text numberOfLines={1} variant="body-sm" allowFontScaling={false}>
                            {player.name}
                        </Text>
                        {!isMe && !hideIcons && player.profileId && player.verified && <Icon color="brand" icon="circle-check" size={12} />}
                    </View>
                )}

                {footer ? (
                    footer(player)
                ) : (
                    <Text color="subtle" variant="body-xs" numberOfLines={1} allowFontScaling={false}>
                        {player.games} Games
                    </Text>
                )}
            </Card>
        );
    }

    return (
        <TouchableOpacity
            className="flex-row items-center w-full gap-2"
            ref={(ref) => generateTestHook('Search.Player.' + player.profileId)({ props: { onPress: onSelect } })}
            onPress={onSelect}
            style={playerStyle}
        >
            {image ? (
                image(player)
            ) : (
                <CountryImage style={{ textAlign: 'center', fontSize: 30 }} country={player.country} />
            )}
            <View>
                <View className="flex-row gap-1 items-center">
                    <Text numberOfLines={1} variant="label">
                        {player.name}
                    </Text>
                    {isMe && !hideIcons && <Icon color="brand" icon="user" size={12} />}
                    {!isMe && !hideIcons && player.profileId && player.verified && <Icon color="brand" icon="circle-check" size={12} />}
                </View>
                {footer ? (
                    footer(player)
                ) : (
                    <Text variant="body-sm" color="subtle">
                        {player.games} Games
                    </Text>
                )}
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

interface ISearchProps<PlayerType extends IPlayerListPlayer>
    extends Omit<FlatListProps<PlayerType | 'select' | 'follow' | 'loading'>, 'data' | 'renderItem'> {
    list: (PlayerType | 'select' | 'follow' | 'loading')[];
    selectedUser?: (user: any) => void;
    actionText?: string;
    action?: (player: PlayerType) => React.ReactNode;
    footer?: (player?: PlayerType) => React.ReactNode;
    image?: (player?: PlayerType) => React.ReactNode;
    variant?: 'vertical' | 'horizontal';
    flatListRef?: FlatListRef<PlayerType | 'select' | 'follow' | 'loading'>;
    hideIcons?: boolean;
    playerStyle?: ViewStyle;
}

export default function PlayerList<PlayerType extends IPlayerListPlayer>({
    list,
    selectedUser,
    actionText,
    action,
    variant = 'vertical',
    flatListRef,
    footer,
    image,
    hideIcons,
    playerStyle,
    ...props
}: ISearchProps<PlayerType>) {
    return (
        <FlatList
            initialNumToRender={variant === 'horizontal' ? 5 : undefined}
            ref={flatListRef}
            data={list}
            horizontal={variant === 'horizontal'}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            ItemSeparatorComponent={() =>
                variant === 'vertical' ? <View className="h-[1px] bg-gray-200 dark:bg-gray-800 w-full my-2.5" /> : <View className="w-2" />
            }
            contentContainerStyle="px-4"
            renderItem={({ item }) => {
                return (
                    <Player
                        player={item}
                        selectedUser={selectedUser}
                        actionText={actionText}
                        action={action}
                        footer={footer}
                        image={image}
                        variant={variant}
                        hideIcons={hideIcons}
                        playerStyle={playerStyle}
                    />
                );
            }}
            keyExtractor={(_item, index) => index.toString()}
            className={variant === 'horizontal' ? 'flex-none' : ''}
            {...props}
        />
    );
}
