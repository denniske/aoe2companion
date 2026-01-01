import { View } from 'react-native';
import { startCase } from 'lodash';
import { genericCivIcon, getCivIconLocal } from '../../../helper/civs';
import { Civ, civs, getCivNameById, orderCivs } from '@nex/data';
import { Filter } from '../filter';
import { getDifficultyName } from '../../../helper/difficulties';
import { useTranslation } from '@app/helper/translate';
import { usePrefData } from '@app/queries/prefs';
import { useSavePrefsMutation } from '@app/mutations/save-account';
import cn from 'classnames';
import { containerClassName } from '@app/styles';


export const BuildFilters = () => {
    const getTranslation = useTranslation();
    const buildTypeOptions = [undefined, 'favorites', 'fastCastle', 'fastFeudal', 'fastImperial', 'arena', 'drush', 'water', 'meme'] as const;

    const buildFilter = usePrefData((state) => state?.buildFilter);
    const civilization = buildFilter?.civilization;
    const difficulty = buildFilter?.difficulty;
    const buildType = buildFilter?.buildType;

    const savePrefsMutation = useSavePrefsMutation();

    const setFilter = (key: 'civilization' | 'difficulty' | 'buildType', value: Civ | string | number | null | undefined) => {
        savePrefsMutation.mutate({
            buildFilter: {
                ...buildFilter,
                [key]: value,
            }
        });
    };

    const civIcon = civilization ? getCivIconLocal(civilization) : genericCivIcon;
    const civOptions: Array<Civ | undefined> = [undefined, ...orderCivs(civs.filter((civ) => civ !== 'Indians'))];

    return (
        <View className={cn("relative z-1 flex flex-row items-center justify-center gap-[15px] py-4", containerClassName)}>
            <Filter
                icon={civIcon}
                onChange={(civ) => setFilter('civilization', civ)}
                label={getTranslation('builds.filters.civ')}
                value={civilization}
                options={civOptions.map((value) => ({
                    value,
                    label: !value ? getTranslation('builds.filters.all') : getCivNameById(value),
                    icon: !value ? genericCivIcon : getCivIconLocal(value),
                }))}
            />
            <Filter
                onChange={(diff) => setFilter('difficulty', diff)}
                label={getTranslation('builds.filters.difficulty')}
                value={difficulty}
                options={([undefined, 1, 2, 3] as const).map((value) => ({
                    value,
                    label: !value ? getTranslation('builds.filters.all') : getDifficultyName(getTranslation, value),
                }))}
            />
            <Filter
                onChange={(type) => setFilter('buildType', type)}
                label={getTranslation('builds.filters.type')}
                value={buildType}
                options={buildTypeOptions.map((value) => ({
                    value,
                    label:
                        !value
                            ? getTranslation('builds.filters.all')
                            : value === 'favorites'
                              ? getTranslation('builds.favorites')
                              : startCase(value),
                }))}
            />
        </View>
    );
};
