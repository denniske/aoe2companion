import { useEffect, useRef, useState } from 'react';
import { Field } from './field';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { RecentSearches } from '@app/view/components/recent-searches';
import { router } from 'expo-router';
import useDebounce from '@app/hooks/use-debounce';
import { useProfilesByProfileIds, useProfilesBySearchInfiniteQuery, useProfilesBySteamId } from '@app/queries/all';
import compact from 'lodash/compact';
import { IProfilesResultProfile } from '@app/api/helper/api.types';
import PlayerList from '@app/view/components/player-list';
import { Button } from './button';
import { useRecentSearches } from '@app/service/recent-searches';
import { Text } from './text';
import { useTranslation } from '@app/helper/translate';

function onlyDigits(str: string) {
    return /^\d+$/.test(str);
}

export const InlinePlayerSearch: React.FC<{ onSelect?: (profile: IProfilesResultProfile) => void; showViewAll?: boolean }> = ({
    showViewAll = true,
    onSelect,
}) => {
    const getTranslation = useTranslation();
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const debouncedText = useDebounce(text, 250);
    const { add: addRecentSearch, data } = useRecentSearches();

    const { data: userPages, isFetching } = useProfilesBySearchInfiniteQuery(debouncedText);
    const { data: usersBySteamId } = useProfilesBySteamId(debouncedText, onlyDigits(debouncedText));
    const { data: usersByProfileId } = useProfilesByProfileIds([parseInt(debouncedText)], onlyDigits(debouncedText));

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
        } else {
            router.navigate(`/players/${profile.profileId}`);
        }
    };

    const viewAll = () => {
        setText('');
        setIsFocused(false);
        router.navigate(`/players/search?query=${text}`);
    };

    useEffect(() => {
        function handleFocusOutside(event: FocusEvent): void {
            if (ref.current && !ref.current.contains(event.relatedTarget as Node)) {
                setText('');
                setIsFocused(false);
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
                type="search"
                placeholder="Search Players"
                onFocus={() => setIsFocused(true)}
                style={{ zIndex: 1 }}
                onChangeText={setText}
                value={text}
                onKeyPress={(e) => {
                    if (e.nativeEvent.key === 'Enter') {
                        viewAll();
                    }
                }}
            />

            {(isFocused || text) && (
                <View className="absolute -top-3 -right-3 -left-3 bg-white dark:bg-black rounded-lg shadow-md dark:shadow-black">
                    <View className="h-18 rounded-md" />

                    {debouncedText !== text || isFetching ? (
                        <View className="pb-3">
                            <ActivityIndicator animating size="large" color="#999" />
                        </View>
                    ) : debouncedText ? (
                        <View>
                            <PlayerList
                                list={list.slice(0, 5)}
                                selectedUser={onSelectUser}
                                keyExtractor={(item) => (typeof item === 'string' ? item : item.profileId.toString())}
                            />

                            {showViewAll && list.length > 5 && (
                                <View className="px-4">
                                    <View className="h-px bg-gray-200 dark:bg-gray-800 w-full mt-2.5" />
                                    <Pressable onPress={viewAll} className="p-3 items-center">
                                        <Text variant="label">View All</Text>
                                    </Pressable>
                                </View>
                            )}
                        </View>
                    ) : data.length > 0 ? (
                        <View className="pb-2.5">
                            <RecentSearches onSelect={onSelectUser} limit={5} />
                        </View>
                    ) : (
                        <Text variant="label" align="center" className="pb-4">
                            {getTranslation('search.minlength')}
                        </Text>
                    )}
                </View>
            )}
        </div>
    );
};
