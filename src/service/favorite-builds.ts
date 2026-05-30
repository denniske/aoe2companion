import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { camelCase, compact } from 'lodash';
import { useEffect } from 'react';
import { useAccount } from '@app/queries/all';
import { useSaveAccountMutation } from '@app/mutations/save-account';
// import { Widget } from '@/modules/widget';
import { Platform, Image } from 'react-native';
import { fetchBuilds } from '@app/api/helper/api';
import { genericCivIcon, getCivIconLocal } from '@app/helper/civs';
import { appConfig } from '@nex/dataset';
import { Paths } from 'expo-file-system';
import { md5, widgetGroupDir, widgetSetFileIfNotExists } from '@app/service/storage';
import AABuilds from '@app/widgets/AABuilds.widget';
import Constants from 'expo-constants';

export const useFavoritedBuilds = () => {
    const { getItem, removeItem } = useAsyncStorage('favoritedBuilds');

    const { data: account, isLoading: isLoadingAccount } = useAccount();
    const favoriteIds = compact(account?.favoriteBuildIds);

    // console.log('====> favoriteIds', favoriteIds);

    const saveAccountMutation = useSaveAccountMutation();

    const readItemFromStorage = async () => {
        // console.log('=> cond', `${!isLoadingAccount} && ${!account?.favoriteBuildIds} || ${account?.favoriteBuildIds?.length == 0}`)
        if (!isLoadingAccount && !account?.favoriteBuildIds || account?.favoriteBuildIds?.length == 0) {
            const item = await getItem();
            // console.log('=> item', item)
            if (item) {
                const favorites = JSON.parse(item);

                // console.log('Migrating local favorited builds to server', favorites, account?.accountId);
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

        saveAccountMutation.mutate({
            favoriteBuildIds,
        });

        // await setItem(JSON.stringify(favoriteBuildIds));

        // Store favorite builds for widget (just first page should be enough)
        const favoriteBuildsResult = await fetchBuilds({ build_ids: favoriteBuildIds });
        const builds = favoriteBuildsResult.builds;

        if (Platform.OS === 'ios' && appConfig.game === 'aoe2') {
            await (async () => {
                const favoriteBuilds = [];

                for (const build of builds) {
                    const imagePath = Paths.join(widgetGroupDir, `${await md5(build.imageURL)}.png`);
                    const imageSource = () => build.imageURL;

                    // The path actually can also be any string like an md5 of the actual path
                    const civilizationPath = Paths.join(widgetGroupDir, `${camelCase(build.civilization)}.png`);
                    const civilizationSource = () => Image.resolveAssetSource(getCivIconLocal(build.civilization) ?? genericCivIcon).uri;

                    favoriteBuilds.push({
                        ...build,
                        imageUrl: await widgetSetFileIfNotExists(imagePath, imageSource),
                        civilizationImageUrl: await widgetSetFileIfNotExists(civilizationPath, civilizationSource),
                    });
                }

                AABuilds.updateSnapshot({
                    builds: favoriteBuilds,
                });

                console.log('favoriteBuilds', favoriteBuilds?.length);
                console.log('favoriteBuilds', favoriteBuilds);
            })();
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
