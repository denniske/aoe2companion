import { Alert, Pressable, View } from 'react-native';
import { Text } from '@app/components/text';
import { useTranslation } from '@app/helper/translate';
import { Icon } from '@app/components/icon';
import { useRecentSearches } from '@app/service/recent-searches';
import PlayerList from './player-list';
import { IProfilesResultProfile } from '@app/api/helper/api.types';

interface RecentSearchesProps {
    onSelect: (player: IProfilesResultProfile) => void;
    actionText?: string;
    action?: (player: IProfilesResultProfile) => React.ReactNode;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({ onSelect, action, actionText }) => {
    const { data, clear } = useRecentSearches();
    const getTranslation = useTranslation();

    if (data.length === 0) {
        return (
            <View className="flex-1 items-center justify-center gap-2 p-2 pb-40">
                <Icon icon="search" size={36} color="subtle" />
                <View className="items-center">
                    <Text variant="header">{getTranslation('search.recent.empty.title')}</Text>
                    <Text color="subtle">{getTranslation('search.recent.empty.description')}</Text>
                </View>
            </View>
        );
    }

    return (
        <View className="gap-2">
            <View className="flex-row justify-between items-center px-4">
                <Text variant="header-sm">{getTranslation('search.recent.title')}</Text>

                <Pressable
                    onPress={() =>
                        Alert.alert(getTranslation('search.recent.clear.confirm.title'), getTranslation('search.recent.clear.confirm.note'), [
                            {
                                text: getTranslation('search.recent.clear.confirm.clear'),
                                style: 'destructive',
                                onPress: () => clear(),
                            },
                            {
                                text: getTranslation('search.recent.clear.confirm.cancel'),
                                style: 'cancel',
                            },
                        ])
                    }
                    className="py-1 px-2"
                >
                    <Text variant="label" color="brand">
                        {getTranslation('search.recent.clear')}
                    </Text>
                </Pressable>
            </View>

            <View className="px-4">
                <View className="h-px bg-gray-200 dark:bg-gray-800 w-full" />
            </View>

            <PlayerList
                actionText={actionText}
                list={data}
                action={action}
                selectedUser={onSelect}
                keyExtractor={(item) => (typeof item === 'string' ? item : item.profileId.toString())}
            />
        </View>
    );
};
