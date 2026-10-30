import { Link } from '@app/components/link';
import { Text } from '@app/components/text';
import { Aoe4Explorer } from '@nex/data';
import React from 'react';

export const AOE4WORLD_EXPLORER_URL = 'https://aoe4world.com/explorer';
const AOE4WORLD_DATA_URL = 'https://github.com/aoe4world/data';

const explorerPathByType: Partial<Record<string, string>> = { unit: 'units', building: 'buildings', technology: 'technologies' };

/** The same item on aoe4world's explorer. Upgrades have no page there, so they get the explorer itself. */
export function aoe4WorldItemUrl(item: { id: string; type: string }) {
    const path = explorerPathByType[item.type];
    return path ? `${AOE4WORLD_EXPLORER_URL}/${path}/${item.id}` : AOE4WORLD_EXPLORER_URL;
}

export function aoe4WorldCivUrl(abbr: string) {
    const slug = Aoe4Explorer.aoe4CivSlugByAbbr[abbr];
    return slug ? `${AOE4WORLD_EXPLORER_URL}/civs/${slug}` : AOE4WORLD_EXPLORER_URL;
}

/**
 * Credit for the explorer data, like the Fandom note on the aoe2 pages: the items are aoe4world's
 * parser output (aoe4world/data), run on the game files by poc_collector's watch-data.
 */
export const Aoe4WorldAttribution: React.FC<{ name?: string; url?: string; className?: string }> = ({ name, url, className }) => (
    <Text variant="body-sm" color="subtle" className={className}>
        {name && url ? (
            <>
                {'This page uses data from the '}
                <Link alt variant="body-sm" href={url as any} target="_blank">
                    {name}
                </Link>
                {' page of the '}
            </>
        ) : (
            'This page uses data from the '
        )}
        <Link alt variant="body-sm" href={AOE4WORLD_EXPLORER_URL as any} target="_blank">
            AoE4 World Explorer
        </Link>
        {', parsed from the game files with '}
        <Link alt variant="body-sm" href={AOE4WORLD_DATA_URL as any} target="_blank">
            aoe4world/data
        </Link>
        {'.'}
    </Text>
);
