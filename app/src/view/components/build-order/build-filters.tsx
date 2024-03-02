import { StyleSheet, View } from 'react-native';
import { createStylesheet } from '../../../theming-new';
import { flatten, startCase, uniq } from 'lodash';
import { IBuildOrder } from '../../../../../data/src/helper/builds';
import { useBuildFilters } from '../../../service/storage';
import { genericCivIcon, getCivIconLocal } from '../../../helper/civs';
import { Civ, civs, getCivNameById, orderCivs } from '@nex/data';
import { Filter } from '../filter';
import { getDifficultyName } from '../../../helper/difficulties';
import { getTranslation } from '../../../helper/translate';

type FiltersStore = ReturnType<typeof useBuildFilters>;

interface BuildFiltersProps extends FiltersStore {
    builds: IBuildOrder[];
}

export const BuildFilters: React.FC<BuildFiltersProps> = ({ builds, filters: { civilization, difficulty, buildType }, setFilter }) => {
    const styles = useStyles();
    const buildTypeOptions = ['all', 'favorites', ...uniq(flatten(builds.map((build) => build.attributes)))] as const;

    const civIcon = getCivIconLocal(civilization) ?? genericCivIcon;
    const civOptions: Array<Civ | 'all'> = ['all', ...orderCivs(civs.filter((civ) => civ !== 'Indians'))];

    return (
        <View style={styles.filtersContainer}>
            {civilization && (
                <Filter
                    icon={civIcon}
                    onChange={(civ) => setFilter('civilization', civ)}
                    label={getTranslation('builds.filters.civ')}
                    value={civilization}
                    options={civOptions.map((value) => ({
                        value,
                        label: value === 'all' ? getTranslation('builds.filters.all') : getCivNameById(value),
                        icon: getCivIconLocal(value) ?? genericCivIcon,
                    }))}
                />
            )}

            {difficulty && (
                <Filter
                    onChange={(diff) => setFilter('difficulty', diff)}
                    label={getTranslation('builds.filters.difficulty')}
                    value={difficulty}
                    options={(['all', 1, 2, 3] as const).map((d) => ({
                        label: getDifficultyName(d) ?? getTranslation('builds.filters.all'),
                        value: d,
                    }))}
                />
            )}

            {buildType && (
                <Filter
                    onChange={(type) => setFilter('buildType', type)}
                    label={getTranslation('builds.filters.type')}
                    value={buildType}
                    options={buildTypeOptions.map((value) => ({
                        value,
                        label:
                            value === 'all'
                                ? getTranslation('builds.filters.all')
                                : value === 'favorites'
                                  ? getTranslation('builds.favorites')
                                  : startCase(value),
                    }))}
                />
            )}
        </View>
    );
};

const useStyles = createStylesheet((theme, darkMode) =>
    StyleSheet.create({
        filtersContainer: {
            zIndex: 1,
            gap: 15,
            padding: 16,
            position: 'relative',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
    })
);
