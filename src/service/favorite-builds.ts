import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { widgetsDirectory } from 'expo-widgets';
import Constants from 'expo-constants';

// Read straight off the module API rather than via useAsyncStorage: that hook builds
// new getItem/removeItem closures on every call, so listing them as dependencies of
// the migration effect below would re-run it on every render.
const FAVORITED_BUILDS_KEY = 'favoritedBuilds';

export const useFavoritedBuilds = () => {
    const { data: account, isLoading: isLoadingAccount } = useAccount();
    const favoriteIds = compact(account?.favoriteBuildIds);

    // console.log('====> favoriteIds', favoriteIds);

    // Destructured: react-query returns a new mutation object every render, but
    // `mutate` itself is a stable reference, so the migration effect below can depend
    // on it without re-running (and re-migrating) on every render.
    const { mutate: saveAccount } = useSaveAccountMutation();

    useEffect(() => {
        const readItemFromStorage = async () => {
            // console.log('=> cond', `${!isLoadingAccount} && ${!account?.favoriteBuildIds} || ${account?.favoriteBuildIds?.length == 0}`)
            if (!isLoadingAccount && !account?.favoriteBuildIds || account?.favoriteBuildIds?.length == 0) {
                const item = await AsyncStorage.getItem(FAVORITED_BUILDS_KEY);
                // console.log('=> item', item)
                if (item) {
                    const favorites = JSON.parse(item);

                    // console.log('Migrating local favorited builds to server', favorites, account?.accountId);
                    await saveAccount({
                        favoriteBuildIds: favorites,
                    });
                    await AsyncStorage.removeItem(FAVORITED_BUILDS_KEY);
                }
            }
        };

        readItemFromStorage();
    }, [isLoadingAccount, account, saveAccount]);

    const toggleFavorite = async (id: string) => {
        let favoriteBuildIds;
        if (favoriteIds.includes(id)) {
            favoriteBuildIds = favoriteIds.filter((favoriteId) => favoriteId !== id);
        } else {
            favoriteBuildIds = [...favoriteIds, id];
        }

        saveAccount({
            favoriteBuildIds,
        });

        // await setItem(JSON.stringify(favoriteBuildIds));

        // Store favorite builds for widget (just first page should be enough)
        const favoriteBuildsResult = await fetchBuilds({ build_ids: favoriteBuildIds });
        const builds = favoriteBuildsResult.builds;

        if ((Platform.OS === 'ios' || Platform.OS === 'android') && appConfig.game === 'aoe2') {
            await (async () => {
                const favoriteBuilds = [];
                // iOS widgets read from the app group; Android ones from expo-widgets' own directory.
                const widgetDir = Platform.OS === 'ios' ? widgetGroupDir : widgetsDirectory;

                for (const build of builds) {
                    const imagePath = Paths.join(widgetDir, `${await md5(build.imageURL)}.png`);
                    const imageSource = () => build.imageURL;

                    // The path actually can also be any string like an md5 of the actual path
                    const civilizationPath = Paths.join(widgetDir, `${camelCase(build.civilization)}.png`);
                    const civilizationAsset = Image.resolveAssetSource(getCivIconLocal(build.civilization) ?? genericCivIcon)?.uri;

                    // An Android release build resolves bundled assets to a bare drawable name rather
                    // than a url. The widget loads those itself, and there is nothing to download.
                    const isDrawableName = Platform.OS === 'android' && civilizationAsset != null && !civilizationAsset.includes(':');

                    favoriteBuilds.push({
                        ...build,
                        imageUrl: await widgetSetFileIfNotExists(imagePath, imageSource),
                        civilizationImageUrl: isDrawableName
                            ? civilizationAsset
                            : await widgetSetFileIfNotExists(civilizationPath, () => civilizationAsset),
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
