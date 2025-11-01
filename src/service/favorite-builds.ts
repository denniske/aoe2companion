import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { camelCase, compact } from 'lodash';
import { useEffect } from 'react';
import { useAccount } from '@app/queries/all';
import { useSaveAccountMutation } from '@app/mutations/save-account';
import { Widget } from '@/modules/widget';
import { Platform, Image } from 'react-native';
import { fetchBuilds } from '@app/api/helper/api';
import { genericCivIcon, getCivIconLocal } from '@app/helper/civs';
import { appConfig } from '@nex/dataset';

export const useFavoritedBuilds = () => {
    const { getItem, removeItem } = useAsyncStorage('favoritedBuilds');

    const { data: account, isLoading: isLoadingAccount } = useAccount();
    const favoriteIds = compact(account?.favoriteBuildIds);

    const saveAccountMutation = useSaveAccountMutation();

    const readItemFromStorage = async () => {
        console.log('=> cond', `${!isLoadingAccount} && ${!account?.favoriteBuildIds} || ${account?.favoriteBuildIds?.length == 0}`)
        if (!isLoadingAccount && !account?.favoriteBuildIds || account?.favoriteBuildIds?.length == 0) {
            const item = await getItem();
            console.log('=> item', item)
            if (item) {
                const favorites = JSON.parse(item);

                console.log('Migrating local favorited builds to server', favorites, account?.accountId);
                await saveAccountMutation.mutate({
                    favoriteBuildIds: favorites,
                });
                await removeItem();
            }
        }
    };

    useEffect(() => {
        readItemFromStorage();
    }, [isLoadingAccount, account]);

    const toggleFavorite = async (id: string) => {
        let favoriteBuildIds;
        if (favoriteIds.includes(id)) {
            favoriteBuildIds = favoriteIds.filter((favoriteId) => favoriteId !== id);
        } else {
            favoriteBuildIds = [...favoriteIds, id];
        }

        await saveAccountMutation.mutate({
            favoriteBuildIds,
        });

        // await setItem(JSON.stringify(favoriteBuildIds));

        // Store favorite builds for widget (just first page should be enough)
        const favoriteBuildsResult = await fetchBuilds({ build_ids: favoriteBuildIds });
        const favoriteBuilds = favoriteBuildsResult.builds;

        if (Platform.OS === 'ios' && appConfig.game === 'aoe2') {
            const newWidgetData = JSON.stringify(
                favoriteBuilds
                    .map((build) => ({
                        id: build.id.toString(),
                        title: build.title,
                        civilization: build.civilization,
                        image:
                            Widget.getImagePathIfExists(`${camelCase(build.civilization)}.png`) ??
                            Widget.setImage(
                                Image.resolveAssetSource(getCivIconLocal(build.civilization) ?? genericCivIcon).uri,
                                `${camelCase(build.civilization)}.png`
                            ),
                        icon:
                            Widget.getImagePathIfExists(`${camelCase(build.image.toString())}.png`) ??
                            Widget.setImage(Image.resolveAssetSource({ uri: build.imageURL }).uri, `${camelCase(build.image.toString())}.png`),
                    }))
            );
            Widget.setItem('savedData', newWidgetData);
            Widget.reloadAll();
        }
    };

    return {
        toggleFavorite,
        favoriteIds,
    };
};

export const useFavoritedBuild = (id: string) => {
    const { favoriteIds, toggleFavorite } = useFavoritedBuilds();

    return {
        toggleFavorite: () => toggleFavorite(id),
        isFavorited: favoriteIds.includes(id),
    };
};
