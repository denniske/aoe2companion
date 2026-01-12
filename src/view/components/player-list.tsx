import { Button } from '@app/components/button';
import { Card } from '@app/components/card';
import { FlatList, FlatListProps, FlatListRef } from '@app/components/flat-list';
import { Icon } from '@app/components/icon';
import { Skeleton, SkeletonText } from '@app/components/skeleton';
import { Text } from '@app/components/text';
import { Href, Link } from 'expo-router';
import React, { useMemo } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { Image } from '@/src/components/uniwind/image';
import { useCavy } from '../testing/tester';
import { useAuthProfileId } from '@app/queries/all';
import { useBreakpoints } from '@app/hooks/use-breakpoints';
import { UserLoginWrapper } from '@app/components/user-login-wrapper';
import { CustomFragment } from '@app/components/custom-fragment';

export interface IPlayerListPlayer {
    country?: string;
    games?: number;
    name?: string;
    profileId: number;
    steamId?: string;
    verified?: boolean;
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
    shouldLink: boolean;
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
    shouldLink,
}: IPlayerProps<PlayerType>) {
    const { isMedium } = useBreakpoints();
    const generateTestHook = useCavy();
    const authProfileId = useAuthProfileId();

    const FullSkeleton = useMemo(
        () => (
            <>
                <View className="w-7 h-7 md:w-12 md:h-12 items-center justify-center">
                    <Skeleton className="w-6 h-6 md:w-10 md:h-10" />
                </View>
                <SkeletonText variant={isMedium ? 'label' : 'body-sm'} />
                {footer ? footer() : <SkeletonText variant={isMedium ? 'body-sm' : 'body-xs'} />}
            </>
        ),
        [footer]
    );

    if (player === 'loading') {
        return (
            <Card direction="vertical" className="items-center justify-center gap-1! py-2 px-2.5 w-20 md:w-32 md:py-4" style={playerStyle}>
                {FullSkeleton}
            </Card>
        );
    }

    if (player === 'select') {
        return (
            <UserLoginWrapper
                Component={Card}
                direction="vertical"
                className="items-center justify-center gap-1! py-2 px-2.5 w-20 md:w-32 md:py-4 relative"
                href="/players/select"
                style={playerStyle}
            >
                <View className="opacity-0 gap-1">{FullSkeleton}</View>

                <View className="absolute inset-0 items-center justify-center gap-2">
                    <Icon icon="user" color="brand" size={isMedium ? 48 : 28} />
                    <Text numberOfLines={1} variant={isMedium ? 'label' : 'body-sm'} allowFontScaling={false}>
                        Find Me
                    </Text>
                </View>
            </UserLoginWrapper>
        );
    }

    if (player === 'follow') {
        return (
            <UserLoginWrapper
                Component={Card}
                direction="vertical"
                className="items-center justify-center gap-1! py-2 px-2.5 w-20 md:w-32 md:py-4 relative"
                href="/players/follow"
                style={playerStyle}
            >
                <View className="opacity-0 gap-1">{FullSkeleton}</View>

                <View className="absolute inset-0 items-center justify-center gap-2">
                    <Icon icon="plus" color="brand" size={isMedium ? 48 : 28} />
                    <Text numberOfLines={1} variant={isMedium ? 'label' : 'body-sm'} allowFontScaling={false}>
                        Add Player
                    </Text>
                </View>
            </UserLoginWrapper>
        );
    }

    const isMe = player.profileId === authProfileId;
    let href: Href | undefined;

    if (shouldLink) {
        if ('href' in player) {
            href = player.href as Href;
        } else if (player.profileId) {
            href = `/players/${player.profileId}`;
        }
    }

    if (variant === 'horizontal') {
        return (
            <Card
                direction="vertical"
                className="items-center justify-center gap-1! py-2 px-2.5 md:min-w-32 md:py-4"
                style={playerStyle}
                onPress={selectedUser ? () => selectedUser?.(player) : undefined}
                href={href}
            >
                {image ? image(player) : <Image source={{ uri: player.avatarMediumUrl }} className="w-7 h-7 md:w-12 md:h-12 rounded-full" />}
                {!!player.name && (
                    <View className="flex-row gap-1 max-w-full items-center">
                        {isMe && !hideIcons && <Icon color="brand" icon="user" size={12} />}
                        <Text numberOfLines={1} variant={isMedium ? 'label' : 'body-sm'} allowFontScaling={false}>
                            {player.name}
                        </Text>
                        {!isMe && !hideIcons && player.profileId && player.verified && <Icon color="brand" icon="circle-check" size={12} />}
                    </View>
                )}

                {footer ? (
                    footer(player)
                ) : (
                    <Text color="subtle" variant={isMedium ? 'body-sm' : 'body-xs'} numberOfLines={1} allowFontScaling={false}>
                        {player.games || '<10'} Games
                    </Text>
                )}
            </Card>
        );
    }

    const Wrapper = href ? Link : CustomFragment;

    return (
        <Wrapper href={href!} asChild>
            <TouchableOpacity
                className="flex-row items-center w-full gap-2"
                ref={(ref) => generateTestHook('Search.Player.' + player.profileId)({ props: { onPress: () => selectedUser?.(player) } }) as any}
                onPress={selectedUser ? () => selectedUser?.(player) : undefined}
                style={playerStyle}
            >
                {image ? image(player) : <Image source={{ uri: player.avatarMediumUrl }} className="w-7 h-7 rounded-full" />}
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
                            {player.games || '<10'} Games
                        </Text>
                    )}
                </View>
                <View className="flex-1 flex-row justify-end gap-2">
                    {action && action(player)}
                    {actionText && selectedUser && (
                        <Button size="small" onPress={() => selectedUser?.(player)} href={href}>
                            {actionText}
                        </Button>
                    )}
                </View>
                <Icon icon="angle-right" color="brand" size={20} />
            </TouchableOpacity>
        </Wrapper>
    );
}

interface ISearchProps<PlayerType extends IPlayerListPlayer>
    extends Omit<FlatListProps<PlayerType | 'select' | 'follow' | 'loading'>, 'data' | 'renderItem'> {
    list?: (PlayerType | 'select' | 'follow' | 'loading')[];
    selectedUser?: (user: any) => void;
    actionText?: string;
    action?: (player: PlayerType) => React.ReactNode;
    footer?: (player?: PlayerType) => React.ReactNode;
    image?: (player?: PlayerType) => React.ReactNode;
    variant?: 'vertical' | 'horizontal';
    flatListRef?: FlatListRef<PlayerType | 'select' | 'follow' | 'loading'>;
    hideIcons?: boolean;
    shouldLink?: boolean;
    playerStyle?: ViewStyle;
}

export default function PlayerList<PlayerType extends IPlayerListPlayer>({
    list = [],
    selectedUser,
    actionText,
    action,
    variant = 'vertical',
    flatListRef,
    footer,
    image,
    hideIcons,
    playerStyle,
    shouldLink = true,
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
                variant === 'vertical' ? <View className="h-px bg-gray-200 dark:bg-gray-800 w-full my-2.5" /> : <View className="w-2" />
            }
            contentContainerClassName="px-4"
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
                        shouldLink={shouldLink}
                    />
                );
            }}
            keyExtractor={(_item, index) => index.toString()}
            className={variant === 'horizontal' ? 'flex-none' : ''}
            {...props}
        />
    );
}
