import { Button } from '@app/components/button';
import { useTranslation } from '@app/helper/translate';
import { Aoe4Explorer } from '@nex/data';
import { faFlask, faHammer, faMap, faSwords, faTowerObservation } from '@fortawesome/sharp-solid-svg-icons';
import { Href } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';

const abbrByCiv = Object.fromEntries(Object.entries(Aoe4Explorer.aoe4CivByAbbr).map(([abbr, civ]) => [civ, abbr]));

/** Buttons to the aoe4 explorer lists; with a civ (app enum) they open filtered to it, and maps are left out. */
export const Aoe4SectionButtons: React.FC<{ civ?: string }> = ({ civ }) => {
    const getTranslation = useTranslation();
    const query = civ && abbrByCiv[civ] ? `?civ=${abbrByCiv[civ]}` : '';
    const buttons = [
        { label: getTranslation('explore.units'), path: 'units', icon: faSwords },
        { label: getTranslation('explore.buildings'), path: 'buildings', icon: faTowerObservation },
        { label: getTranslation('explore.technologies'), path: 'technologies', icon: faFlask },
        { label: getTranslation('unit.heading.upgrades'), path: 'upgrades', icon: faHammer },
        ...(civ ? [] : [{ label: getTranslation('explore.maps'), path: 'maps', icon: faMap }]),
    ];
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2" keyboardShouldPersistTaps="always">
            {buttons.map((b) => (
                <Button key={b.path} icon={b.icon} href={`/explore/${b.path}${query}` as Href}>
                    {b.label}
                </Button>
            ))}
        </ScrollView>
    );
};
