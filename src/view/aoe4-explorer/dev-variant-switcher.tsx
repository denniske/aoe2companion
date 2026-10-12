import { PressableOpacity } from '@app/components/pressable-opacity';
import { Text } from '@app/components/text';
import { appConfig } from '@nex/dataset';
import { containerClassName } from '@app/styles';
import { Checkbox } from '@app/components/checkbox';
import {
    setAoe4ExplorerDevShowRaw,
    setAoe4ExplorerDevVariant,
    useAoe4ExplorerDevShowRaw,
    useAoe4ExplorerDevVariant,
    useAoe4ExplorerDevVariants,
} from '@app/queries/aoe4-explorer';
import cn from 'classnames';
import React from 'react';
import { View } from 'react-native';

// The explorer's own pages; maps, build orders and tips do not read its data.
const EXPLORER_SECTIONS = ['index', 'buildings', 'units', 'technologies', 'upgrades', 'civilizations'];

export const isAoe4ExplorerRoute = (routeName: string) =>
    appConfig.game === 'aoe4' && routeName.startsWith('explore/') && EXPLORER_SECTIONS.includes(routeName.split('/')[1]);

/**
 * DEV ONLY: switches the explorer between the normal data and the variants served by
 * `yarn explorer:variants`. Renders nothing unless that server is running.
 */
export const Aoe4DevVariantSwitcher: React.FC = () => {
    const variants = useAoe4ExplorerDevVariants().data;
    const current = useAoe4ExplorerDevVariant();
    const showRaw = useAoe4ExplorerDevShowRaw();
    if (!__DEV__ || !variants?.length) return null;

    const options: (string | undefined)[] = [undefined, ...variants];
    return (
        <View className={cn('flex-row flex-wrap items-center gap-2 pt-2', containerClassName)}>
            <Text variant="label-sm">Dev data:</Text>
            {options.map((v) => (
                <PressableOpacity
                    key={v ?? 'default'}
                    onPress={() => setAoe4ExplorerDevVariant(v)}
                    className={cn('px-2 py-1 rounded border', v === current ? 'border-gold-500 bg-gold-500/20' : 'border-gray-300 dark:border-gray-700')}
                >
                    <Text variant="label-sm">{v ?? 'default'}</Text>
                </PressableOpacity>
            ))}
            <Checkbox checked={showRaw} onPress={() => setAoe4ExplorerDevShowRaw(!showRaw)} text="show raw info" />
        </View>
    );
};
