import { setLeaderboardCountry, useMutate, useSelector } from '@app/redux/reducer';
import { useAuthProfileId, useProfileFast } from '@app/queries/all';
import { getTranslation } from '@app/helper/translate';
import { getCountryName } from '@app/helper/flags';
import { countriesDistinct, Country } from '@nex/data';
import { CountryImageForDropDown, SpecialImageForDropDown } from '@app/view/components/country-image';
import { appConfig } from '@nex/dataset';
import { StyleSheet, View } from 'react-native';
import Picker from '@app/view/components/picker';
import React from 'react';
import { createStylesheet } from '@app/theming-new';

export const countryEarth = null;

export function isCountry(x: string | null) {
    return countriesDistinct.includes(x?.toUpperCase() as Country);
}

export function CountrySelect() {
    const mutate = useMutate();
    const country = useSelector((state) => state.leaderboardCountry) || null;

    const authProfileId = useAuthProfileId();
    const { data: authProfile } = useProfileFast(authProfileId);
    const authCountry = authProfile?.country;
    const authClan = authProfile?.clan;

    const formatCountry = (x: string | null, inList?: boolean) => {
        if (x == countryEarth) {
            return getTranslation('country.earth');
        }
        if (x == 'following') {
            return getTranslation('country.following');
        }
        if (x.startsWith('Clan')) {
            return x;
        }
        return getCountryName(x as Country);
        // return true ? getCountryName(x as Country) : x?.toUpperCase();
        // return inList ? getCountryName(x as Country) : x?.toUpperCase();
    };
    const orderedCountriesDistinct = countriesDistinct.sort((a, b) => formatCountry(a, true).localeCompare(formatCountry(b, true)));
    const countryList: (string | null)[] = [
        countryEarth,
        'following',
        ...(authClan ? ['Clan ' + authClan] : []),
        ...(authCountry ? [authCountry] : []),
        ...orderedCountriesDistinct,
    ];
    // const divider = (x: any, i: number) => i < (authCountry ? 2 : 1);
    const icon = (x: any) => {
        if (x == countryEarth) {
            return <CountryImageForDropDown country="EARTH" />;
        }
        if (x == 'following') {
            // return <FontAwesome name="heart" size={14} />;
            return <SpecialImageForDropDown emoji="🖤" />;
        }
        if (x.startsWith('Clan')) {
            // return <FontAwesome name="trophy" size={14} />;
            return <SpecialImageForDropDown emoji="⚔️" />;
        }
        return <CountryImageForDropDown country={x} />;
    };
    const onCountrySelected = (country: string | null) => {
        mutate(setLeaderboardCountry(country));
    };

    const divider = (x: any, i: number) => i < (authCountry ? 3 : 2);

    if (appConfig.game === 'aoe4') {
        return <View />;
    }

    const loadingLeaderboard = false;
    // <ActivityIndicator animating={loadingLeaderboard} size="small" color="#999"/>

    return (
            <Picker
                popupAlign="right"
                itemHeight={40}
                textMinWidth={150}
                container="flatlist"
                divider={divider}
                icon={icon}
                disabled={loadingLeaderboard}
                value={country}
                values={countryList}
                formatter={formatCountry}
                onSelect={onCountrySelected}
                style={{ width: 170 }}
            />
    );
}
