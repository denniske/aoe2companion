import { useEffect, useRef, useState } from 'react';
import { Field } from './field';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { RecentSearches } from '@app/view/components/recent-searches';
import { Link, router } from 'expo-router';
import useDebounce from '@app/hooks/use-debounce';
import { useMatch, useProfilesByProfileIds, useProfilesBySearchInfiniteQuery, useProfilesBySteamId } from '@app/queries/all';
import { MatchCard } from '@app/components/match/match-card';
import compact from 'lodash/compact';
import { IProfilesResultProfile } from '@app/api/helper/api.types';
import PlayerList from '@app/view/components/player-list';
import { useRecentSearches } from '@app/service/recent-searches';
import { Text } from './text';
import { useTranslation } from '@app/helper/translate';
import cn from 'classnames';

function onlyDigits(str: string) {
    return /^\d+$/.test(str);
}

// match_id is validated server-side as a postgres int. Anything above answers 400, and unlike the 404
// for an unknown id a 400 is retried -- so a steam id would cost four requests for nothing.
const PG_INT_MAX = 2147483647;

function asMatchId(str: string) {
    if (!onlyDigits(str)) return null;
    const id = Number(str);
    return id > 0 && id <= PG_INT_MAX ? id : null;
}

export const InlinePlayerSearch: React.FC<{
    onSelect?: (profile: IProfilesResultProfile) => void;
    showViewAll?: boolean;
    className?: string;
    position?: 'top' | 'bottom';
    iconColor?: string;
}> = ({ showViewAll = true, onSelect, className, position = 'bottom', iconColor }) => {
    const getTranslation = useTranslation();
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const debouncedText = useDebounce(text, 250);
    const { add: addRecentSearch, data } = useRecentSearches();

    const { data: userPages, isFetching } = useProfilesBySearchInfiniteQuery(debouncedText);
    const { data: usersBySteamId } = useProfilesBySteamId(debouncedText, onlyDigits(debouncedText));
    const { data: usersByProfileId } = useProfilesByProfileIds([parseInt(debouncedText)], onlyDigits(debouncedText));
    // Only when the search navigates: a caller with onSelect is picking a profile, not browsing.
    // A miss is the common case and costs one request: the 404 is not retried (query-client.ts).
    const matchId = asMatchId(debouncedText);
    const { data: matchById } = useMatch(matchId ?? 0, !!matchId && !onSelect);

    const list =
        debouncedText.length < 2
            ? []
            : [...compact(usersByProfileId), ...compact(usersBySteamId), ...compact(userPages?.pages?.flatMap((p) => p.profiles))];

    const onSelectUser = (profile: IProfilesResultProfile) => {
        addRecentSearch(profile);
        setText('');
        setIsFocused(false);
        if (onSelect) {
            onSelect(profile);
        }
    };

    const viewAll = () => {
        setText('');
        setIsFocused(false);
    };

    useEffect(() => {
        function handleFocusOutside(event: FocusEvent): void {
            if (ref.current && !ref.current.contains(event.relatedTarget as Node)) {
                setTimeout(() => {
                    setText('');
                    setIsFocused(false);
                }, 250);
            }
        }
        document.addEventListener('focusout', handleFocusOutside);
        return () => {
            document.removeEventListener('focusout', handleFocusOutside);
        };
    });

    return (
        <div className="relative w-2xs" ref={ref}>
            <Field
                iconColor={iconColor}
                className={cn('h-full border-transparent dark:border-border', className)}
                type="search"
                placeholder={getTranslation('search.placeholder.players')}
                onFocus={() => setIsFocused(true)}
                style={{ zIndex: 1, height: 48 }}
                onChangeText={setText}
                value={text}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                onKeyPress={(e) => {
                    if (e.nativeEvent.key === 'Enter' && showViewAll) {
                        viewAll();
                        router.navigate(`/players/search?query=${text}`);
                    }
                }}
            />

            {!!(isFocused || text) && (
                <View
                    className={cn(
                        'absolute -right-3 -left-3 bg-white dark:bg-black rounded-lg shadow-md dark:shadow-black',
                        position === 'top' ? '-bottom-3 flex-col-reverse' : '-top-3'
                    )}
                >
                    <View className="h-18 rounded-md" />

                    {debouncedText !== text || isFetching ? (
                        <View className={position === 'top' ? 'pt-3' : 'pb-3'}>
                            <ActivityIndicator animating size="large" color="#999" />
                        </View>
                    ) : debouncedText ? (
                        <View className={cn(position === 'top' ? 'pt-3' : 'pb-3')}>
                            <PlayerList
                                inverted={position === 'top'}
                                list={list.slice(0, 5)}
                                selectedUser={onSelectUser}
                                shouldLink={!onSelect}
                                keyExtractor={(item) => (typeof item === 'string' ? item : item.profileId.toString())}
                            />

                            {!!matchById && (
                                // Navigates itself rather than via MatchCard's clickable: that press is not
                                // exposed, and the dropdown has to close on it like on a player row.
                                <Pressable
                                    className="px-3 pt-2"
                                    onPress={() => {
                                        viewAll();
                                        router.navigate(`/matches/${matchById.matchId}`);
                                    }}
                                >
                                    <MatchCard match={matchById} flat />
                                </Pressable>
                            )}

                            {showViewAll && list.length > 5 && (
                                <View className="px-4">
                                    <View className="h-px bg-gray-200 dark:bg-gray-800 w-full mt-2.5" />
                                    <Link asChild href={`/players/search?query=${text}`}>
                                        <Pressable onPress={viewAll} className="p-3 items-center">
                                            <Text variant="label">{getTranslation('home.viewAll')}</Text>
                                        </Pressable>
                                    </Link>
                                </View>
                            )}
                        </View>
                    ) : data.length > 0 ? (
                        <View className={position === 'top' ? 'pt-2.5' : 'pb-2.5'}>
                            <RecentSearches onSelect={onSelectUser} limit={5} shouldLink={!onSelect} />
                        </View>
                    ) : (
                        <Text variant="label" align="center" className={position === 'top' ? 'pt-4' : 'pb-4'}>
                            {getTranslation('search.minlength')}
                        </Text>
                    )}
                </View>
            )}
        </div>
    );
};
