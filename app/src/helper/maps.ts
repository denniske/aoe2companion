import {AoeMap, getString} from '@nex/data';
import {getStringId} from './strings';
import {appConfig, mapsData, mapsFallbackData} from "@nex/dataset";

export const maps = mapsData;
export const mapsFallback = mapsFallbackData;

export function getMapImage(map: AoeMap) {

    if (appConfig.game === 'aoe2de') {
        if (map as any === -2) {
            return mapsFallback;
        }
        const mapRoR = allMapsDe.find(m => m.mapIdRoR === map);
        if (mapRoR) {
            map = mapRoR.mapId as any;
        }
    }

    if (map == null || !(map in maps)) {
        return mapsFallback;
    }
    return maps[map];
}

export function getMapImageByLocationString(map: string) {
    if (map == null) {
        return mapsFallback;
    }
    const stringId = getStringId('map_type', map) as AoeMap;
    if (stringId == null || !(stringId in maps)) {
        return mapsFallback;
    }
    return maps[stringId as AoeMap];
}

export function getMapName(map: AoeMap, ugc: boolean, rms: string, game_mode: any, scenario: string) {

    if (appConfig.game === 'aoe2de') {
        if (game_mode === 3) {
            // return 'Scenario: ' + scenario.replace('.aoe2scenario', '');
            return scenario.replace('.aoe2scenario', '') + ' (Scenario)';
        }
        if (ugc && map as any === -2) {
            // return 'Custom: ' + rms.replace('.rms', '');
            return rms.replace('.rms', '') + ' (Custom)';
        }
        if (map as any === -2) {
            return 'Unknown';
        }
        const mapRoR = allMapsDe.find(m => m.mapIdRoR === map);
        if (mapRoR) {
            map = mapRoR.mapId as any;
        }
    }

    if (map == null) {
        return 'Custom';
    }
    return getString('map_type', map);
}

const allMapsDe = [
    {
        "mapId": 9,
        "mapIdRoR": 10875,
        "enum": "rm_arabia",
        "file": "rm_arabia"
    },
    {
        "mapId": 10,
        "mapIdRoR": 10876,
        "enum": "rm_archipelago",
        "file": "rm_archipelago"
    },
    {
        "mapId": 11,
        "mapIdRoR": 10877,
        "enum": "rm_baltic",
        "file": "rm_baltic"
    },
    {
        "mapId": 12,
        "mapIdRoR": 10878,
        "enum": "rm_black-forest",
        "file": "rm_black-forest"
    },
    {
        "mapId": 13,
        "mapIdRoR": 10879,
        "enum": "rm_coastal",
        "file": "rm_coastal"
    },
    {
        "mapId": 14,
        "mapIdRoR": 10880,
        "enum": "rm_continental",
        "file": "rm_continental"
    },
    {
        "mapId": 15,
        "mapIdRoR": 10881,
        "enum": "rm_crater-lake",
        "file": "rm_crater-lake"
    },
    {
        "mapId": 16,
        "mapIdRoR": 10882,
        "enum": "rm_fortress",
        "file": "rm_fortress"
    },
    {
        "mapId": 17,
        "mapIdRoR": 10883,
        "enum": "rm_gold-rush",
        "file": "rm_gold-rush"
    },
    {
        "mapId": 18,
        "mapIdRoR": 10884,
        "enum": "rm_highland",
        "file": "rm_highland"
    },
    {
        "mapId": 19,
        "mapIdRoR": 10885,
        "enum": "rm_islands",
        "file": "rm_islands"
    },
    {
        "mapId": 20,
        "mapIdRoR": 10886,
        "enum": "rm_mediterranean",
        "file": "rm_mediterranean"
    },
    {
        "mapId": 21,
        "mapIdRoR": 10887,
        "enum": "rm_migration",
        "file": "rm_migration"
    },
    {
        "mapId": 22,
        "mapIdRoR": 10888,
        "enum": "rm_rivers",
        "file": "rm_rivers"
    },
    {
        "mapId": 23,
        "mapIdRoR": 10889,
        "enum": "rm_team-islands",
        "file": "rm_team-islands"
    },
    {
        "mapId": 24,
        "mapIdRoR": null,
        "enum": "rm_full-random",
        "file": "rm_full-random"
    },
    {
        "mapId": 25,
        "mapIdRoR": 10891,
        "enum": "rm_scandinavia",
        "file": "rm_scandinavia"
    },
    {
        "mapId": 26,
        "mapIdRoR": 10892,
        "enum": "rm_mongolia",
        "file": "rm_mongolia"
    },
    {
        "mapId": 27,
        "mapIdRoR": 10894,
        "enum": "rm_yucatan",
        "file": "rm_yucatan"
    },
    {
        "mapId": 28,
        "mapIdRoR": 10893,
        "enum": "rm_salt-marsh",
        "file": "rm_salt-marsh"
    },
    {
        "mapId": 29,
        "mapIdRoR": 10895,
        "enum": "rm_arena",
        "file": "rm_arena"
    },
    {
        "mapId": 31,
        "mapIdRoR": 10897,
        "enum": "rm_oasis",
        "file": "rm_oasis"
    },
    {
        "mapId": 32,
        "mapIdRoR": 10898,
        "enum": "rm_ghost-lake",
        "file": "rm_ghost-lake"
    },
    {
        "mapId": 33,
        "mapIdRoR": 10901,
        "enum": "rm_nomad",
        "file": "rm_nomad"
    },
    {
        "mapId": 34,
        "mapIdRoR": 10985,
        "enum": "cm_canals",
        "file": "cm_canals"
    },
    {
        "mapId": 35,
        "mapIdRoR": 10986,
        "enum": "cm_capricious",
        "file": "cm_capricious"
    },
    {
        "mapId": 36,
        "mapIdRoR": 10987,
        "enum": "cm_dingos",
        "file": "cm_dingos"
    },
    {
        "mapId": 37,
        "mapIdRoR": 10988,
        "enum": "cm_graveyards",
        "file": "cm_graveyards"
    },
    {
        "mapId": 38,
        "mapIdRoR": 10989,
        "enum": "cm_metropolis",
        "file": "cm_metropolis"
    },
    {
        "mapId": 40,
        "mapIdRoR": 10991,
        "enum": "cm_paradise-island",
        "file": "cm_paradise-island"
    },
    {
        "mapId": 41,
        "mapIdRoR": 10992,
        "enum": "cm_pilgrims",
        "file": "cm_pilgrims"
    },
    {
        "mapId": 42,
        "mapIdRoR": 10993,
        "enum": "cm_prairie",
        "file": "cm_prairie"
    },
    {
        "mapId": 43,
        "mapIdRoR": 10994,
        "enum": "cm_seasons",
        "file": "cm_seasons"
    },
    {
        "mapId": 44,
        "mapIdRoR": 10995,
        "enum": "cm_sherwood-forest",
        "file": "cm_sherwood-forest"
    },
    {
        "mapId": 45,
        "mapIdRoR": 10996,
        "enum": "cm_sherwood-heroes",
        "file": "cm_sherwood-heroes"
    },
    {
        "mapId": 46,
        "mapIdRoR": 10997,
        "enum": "cm_shipwreck",
        "file": "cm_shipwreck"
    },
    {
        "mapId": 47,
        "mapIdRoR": 10998,
        "enum": "cm_team-glaciers",
        "file": "cm_team-glaciers"
    },
    {
        "mapId": 48,
        "mapIdRoR": 10999,
        "enum": "cm_the-unknown",
        "file": "cm_the-unknown"
    },
    {
        "mapId": 49,
        "mapIdRoR": 13544,
        "enum": "rwm_iberia",
        "file": "rwm_iberia"
    },
    {
        "mapId": 50,
        "mapIdRoR": 13545,
        "enum": "rwm_britain",
        "file": "rwm_britain"
    },
    {
        "mapId": 51,
        "mapIdRoR": 13546,
        "enum": "rwm_mideast",
        "file": "rwm_mideast"
    },
    {
        "mapId": 52,
        "mapIdRoR": 13547,
        "enum": "rwm_texas",
        "file": "rwm_texas"
    },
    {
        "mapId": 53,
        "mapIdRoR": 13548,
        "enum": "rwm_italy",
        "file": "rwm_italy"
    },
    {
        "mapId": 54,
        "mapIdRoR": 13549,
        "enum": "rwm_central_america",
        "file": "rwm_central_america"
    },
    {
        "mapId": 55,
        "mapIdRoR": 13550,
        "enum": "rwm_france",
        "file": "rwm_france"
    },
    {
        "mapId": 56,
        "mapIdRoR": 13551,
        "enum": "rwm_norse_lands",
        "file": "rwm_norse_lands"
    },
    {
        "mapId": 57,
        "mapIdRoR": 13552,
        "enum": "rwm_sea_of_japan",
        "file": "rwm_sea_of_japan"
    },
    {
        "mapId": 58,
        "mapIdRoR": 13553,
        "enum": "rwm_byzantium",
        "file": "rwm_byzantium"
    },
    {
        "mapId": 59,
        "mapIdRoR": null,
        "enum": "cm_generic",
        "file": "cm_generic"
    },
    {
        "mapId": 60,
        "mapIdRoR": null,
        "enum": "rm_random_land_map",
        "file": "rm_random_land_map"
    },
    {
        "mapId": 62,
        "mapIdRoR": null,
        "enum": "rwm_random_real_world_map",
        "file": "rwm_random_real_world_map"
    },
    {
        "mapId": 63,
        "mapIdRoR": null,
        "enum": "rm_blind_random",
        "file": "rm_blind_random"
    },
    {
        "mapId": 67,
        "mapIdRoR": 10914,
        "enum": "rm_acropolis",
        "file": "rm_acropolis"
    },
    {
        "mapId": 68,
        "mapIdRoR": 10915,
        "enum": "rm_budapest",
        "file": "rm_budapest"
    },
    {
        "mapId": 69,
        "mapIdRoR": 10916,
        "enum": "rm_cenotes",
        "file": "rm_cenotes"
    },
    {
        "mapId": 70,
        "mapIdRoR": 10917,
        "enum": "rm_city-of-lakes",
        "file": "rm_city-of-lakes"
    },
    {
        "mapId": 71,
        "mapIdRoR": 10918,
        "enum": "rm_golden-pit",
        "file": "rm_golden-pit"
    },
    {
        "mapId": 72,
        "mapIdRoR": 10919,
        "enum": "rm_hideout",
        "file": "rm_hideout"
    },
    {
        "mapId": 73,
        "mapIdRoR": 10920,
        "enum": "rm_hill-fort",
        "file": "rm_hill-fort"
    },
    {
        "mapId": 74,
        "mapIdRoR": 10921,
        "enum": "rm_lombardia",
        "file": "rm_lombardia"
    },
    {
        "mapId": 75,
        "mapIdRoR": 10922,
        "enum": "rm_steppe",
        "file": "rm_steppe"
    },
    {
        "mapId": 76,
        "mapIdRoR": 10923,
        "enum": "rm_valley",
        "file": "rm_valley"
    },
    {
        "mapId": 77,
        "mapIdRoR": 10924,
        "enum": "rm_megarandom",
        "file": "rm_megarandom"
    },
    {
        "mapId": 78,
        "mapIdRoR": 10925,
        "enum": "rm_hamburger",
        "file": "rm_hamburger"
    },
    {
        "mapId": 79,
        "mapIdRoR": 10926,
        "enum": "rm_ctr_random",
        "file": "rm_ctr_random"
    },
    {
        "mapId": 80,
        "mapIdRoR": 10927,
        "enum": "rm_ctr_monsoon",
        "file": "rm_ctr_monsoon"
    },
    {
        "mapId": 81,
        "mapIdRoR": 10928,
        "enum": "rm_ctr_pyramid-descent",
        "file": "rm_ctr_pyramid-descent"
    },
    {
        "mapId": 82,
        "mapIdRoR": 10929,
        "enum": "rm_ctr_spiral",
        "file": "rm_ctr_spiral"
    },
    {
        "mapId": 83,
        "mapIdRoR": 301100,
        "enum": "rm_kilimanjaro",
        "file": "rm_kilimanjaro"
    },
    {
        "mapId": 84,
        "mapIdRoR": 301101,
        "enum": "rm_mountain-pass",
        "file": "rm_mountain-pass"
    },
    {
        "mapId": 85,
        "mapIdRoR": 301102,
        "enum": "rm_nile-delta",
        "file": "rm_nile-delta"
    },
    {
        "mapId": 86,
        "mapIdRoR": 301103,
        "enum": "rm_serengeti",
        "file": "rm_serengeti"
    },
    {
        "mapId": 87,
        "mapIdRoR": 301104,
        "enum": "rm_socotra",
        "file": "rm_socotra"
    },
    {
        "mapId": 88,
        "mapIdRoR": 301105,
        "enum": "rwm_amazon",
        "file": "rwm_amazon"
    },
    {
        "mapId": 89,
        "mapIdRoR": 301106,
        "enum": "rwm_china",
        "file": "rwm_china"
    },
    {
        "mapId": 90,
        "mapIdRoR": 301107,
        "enum": "rwm_horn_of_africa",
        "file": "rwm_horn_of_africa"
    },
    {
        "mapId": 91,
        "mapIdRoR": 301108,
        "enum": "rwm_india",
        "file": "rwm_india"
    },
    {
        "mapId": 92,
        "mapIdRoR": 301109,
        "enum": "rwm_madagascar",
        "file": "rwm_madagascar"
    },
    {
        "mapId": 93,
        "mapIdRoR": 301110,
        "enum": "rwm_west_africa",
        "file": "rwm_west_africa"
    },
    {
        "mapId": 94,
        "mapIdRoR": 301111,
        "enum": "rwm_bohemia",
        "file": "rwm_bohemia"
    },
    {
        "mapId": 95,
        "mapIdRoR": 301112,
        "enum": "rwm_earth",
        "file": "rwm_earth"
    },
    {
        "mapId": 96,
        "mapIdRoR": 301113,
        "enum": "sm_canyons",
        "file": "sm_canyons"
    },
    {
        "mapId": 97,
        "mapIdRoR": 301114,
        "enum": "sm_enemy-archipelago",
        "file": "sm_enemy-archipelago"
    },
    {
        "mapId": 98,
        "mapIdRoR": 301115,
        "enum": "sm_enemy-islands",
        "file": "sm_enemy-islands"
    },
    {
        "mapId": 99,
        "mapIdRoR": 301116,
        "enum": "sm_far-out",
        "file": "sm_far-out"
    },
    {
        "mapId": 100,
        "mapIdRoR": 301117,
        "enum": "sm_front-line",
        "file": "sm_front-line"
    },
    {
        "mapId": 101,
        "mapIdRoR": 301118,
        "enum": "sm_inner-circle",
        "file": "sm_inner-circle"
    },
    {
        "mapId": 102,
        "mapIdRoR": 301119,
        "enum": "sm_motherland",
        "file": "sm_motherland"
    },
    {
        "mapId": 103,
        "mapIdRoR": 301120,
        "enum": "sm_open-plains",
        "file": "sm_open-plains"
    },
    {
        "mapId": 104,
        "mapIdRoR": 301121,
        "enum": "sm_ring-of-water",
        "file": "sm_ring-of-water"
    },
    {
        "mapId": 105,
        "mapIdRoR": 301122,
        "enum": "sm_snake-pit",
        "file": "sm_snake-pit"
    },
    {
        "mapId": 106,
        "mapIdRoR": 301123,
        "enum": "sm_the-eye",
        "file": "sm_the-eye"
    },
    {
        "mapId": 107,
        "mapIdRoR": 301124,
        "enum": "rwm_australia",
        "file": "rwm_australia"
    },
    {
        "mapId": 108,
        "mapIdRoR": 301125,
        "enum": "rwm_indochina",
        "file": "rwm_indochina"
    },
    {
        "mapId": 109,
        "mapIdRoR": 301126,
        "enum": "rwm_indonesia",
        "file": "rwm_indonesia"
    },
    {
        "mapId": 110,
        "mapIdRoR": 301127,
        "enum": "rwm_strait_of_malacca",
        "file": "rwm_strait_of_malacca"
    },
    {
        "mapId": 111,
        "mapIdRoR": 301128,
        "enum": "rwm_phillipines",
        "file": "rwm_phillipines"
    },
    {
        "mapId": 112,
        "mapIdRoR": 301129,
        "enum": "rm_bog-islands",
        "file": "rm_bog-islands"
    },
    {
        "mapId": 113,
        "mapIdRoR": 301130,
        "enum": "rm_mangrove-jungle",
        "file": "rm_mangrove-jungle"
    },
    {
        "mapId": 114,
        "mapIdRoR": 301131,
        "enum": "rm_pacific-islands",
        "file": "rm_pacific-islands"
    },
    {
        "mapId": 115,
        "mapIdRoR": 301132,
        "enum": "rm_sandbank",
        "file": "rm_sandbank"
    },
    {
        "mapId": 116,
        "mapIdRoR": 301133,
        "enum": "rm_water-nomad",
        "file": "rm_water-nomad"
    },
    {
        "mapId": 117,
        "mapIdRoR": 301134,
        "enum": "sm_jungle-islands",
        "file": "sm_jungle-islands"
    },
    {
        "mapId": 118,
        "mapIdRoR": 301135,
        "enum": "sm_holy-line",
        "file": "sm_holy-line"
    },
    {
        "mapId": 119,
        "mapIdRoR": 301136,
        "enum": "sm_border-stones",
        "file": "sm_border-stones"
    },
    {
        "mapId": 120,
        "mapIdRoR": 301137,
        "enum": "sm_yin-yang",
        "file": "sm_yin-yang"
    },
    {
        "mapId": 121,
        "mapIdRoR": 301138,
        "enum": "sm_jungle-lanes",
        "file": "sm_jungle-lanes"
    },
    {
        "mapId": 122,
        "mapIdRoR": 301139,
        "enum": "rm_alpine-lakes",
        "file": "rm_alpine-lakes"
    },
    {
        "mapId": 123,
        "mapIdRoR": 301141,
        "enum": "rm_bogland",
        "file": "rm_bogland"
    },
    {
        "mapId": 124,
        "mapIdRoR": 301142,
        "enum": "rm_mountain-ridge",
        "file": "rm_mountain-ridge"
    },
    {
        "mapId": 125,
        "mapIdRoR": 301143,
        "enum": "rm_ravines",
        "file": "rm_ravines"
    },
    {
        "mapId": 126,
        "mapIdRoR": 301144,
        "enum": "rm_wolf-hill",
        "file": "rm_wolf-hill"
    },
    {
        "mapId": 127,
        "mapIdRoR": 301150,
        "enum": "sm_swirling-river",
        "file": "sm_swirling-river"
    },
    {
        "mapId": 128,
        "mapIdRoR": 301151,
        "enum": "sm_twin-forests",
        "file": "sm_twin-forests"
    },
    {
        "mapId": 129,
        "mapIdRoR": 301152,
        "enum": "sm_journey-south",
        "file": "sm_journey-south"
    },
    {
        "mapId": 130,
        "mapIdRoR": 301153,
        "enum": "sm_snake-forest",
        "file": "sm_snake-forest"
    },
    {
        "mapId": 131,
        "mapIdRoR": 301154,
        "enum": "sm_sprawling-stream",
        "file": "sm_sprawling-stream"
    },
    {
        "mapId": 132,
        "mapIdRoR": 301145,
        "enum": "rwm_antarctica",
        "file": "rwm_antarctica"
    },
    {
        "mapId": 133,
        "mapIdRoR": 301146,
        "enum": "rwm_aral_sea",
        "file": "rwm_aral_sea"
    },
    {
        "mapId": 134,
        "mapIdRoR": 301147,
        "enum": "rwm_black_sea",
        "file": "rwm_black_sea"
    },
    {
        "mapId": 135,
        "mapIdRoR": 301148,
        "enum": "rwm_caucasus",
        "file": "rwm_caucasus"
    },
    {
        "mapId": 136,
        "mapIdRoR": 301153,
        "enum": "rwm_caucasus",
        "file": "rwm_caucasus"
    },
    {
        "mapId": 137,
        "mapIdRoR": null,
        "enum": "cm_generic",
        "file": "cm_generic"
    },
    {
        "mapId": 139,
        "mapIdRoR": 10930,
        "enum": "rm_golden-swamp",
        "file": "rm_golden-swamp"
    },
    {
        "mapId": 140,
        "mapIdRoR": 10931,
        "enum": "rm_four-lakes",
        "file": "rm_four-lakes"
    },
    {
        "mapId": 141,
        "mapIdRoR": 10932,
        "enum": "rm_land_nomad",
        "file": "rm_land_nomad"
    },
    {
        "mapId": 142,
        "mapIdRoR": 10933,
        "enum": "br_battle_on_the_ice",
        "file": "br_battle_on_the_ice"
    },
    {
        "mapId": 143,
        "mapIdRoR": 10934,
        "enum": "br_el_dorado",
        "file": "br_el_dorado"
    },
    {
        "mapId": 144,
        "mapIdRoR": 10935,
        "enum": "br_fall_of_axum",
        "file": "br_fall_of_axum"
    },
    {
        "mapId": 145,
        "mapIdRoR": 10936,
        "enum": "br_fall_of_rome",
        "file": "br_fall_of_rome"
    },
    {
        "mapId": 146,
        "mapIdRoR": 10937,
        "enum": "br_the_majapahit_empire",
        "file": "br_the_majapahit_empire"
    },
    {
        "mapId": 147,
        "mapIdRoR": 10938,
        "enum": "rm_amazon_tunnels",
        "file": "rm_amazon_tunnels"
    },
    {
        "mapId": 148,
        "mapIdRoR": 10939,
        "enum": "rm_coastal_forest",
        "file": "rm_coastal_forest"
    },
    {
        "mapId": 149,
        "mapIdRoR": 10940,
        "enum": "rm_african_clearing",
        "file": "rm_african_clearing"
    },
    {
        "mapId": 150,
        "mapIdRoR": 10941,
        "enum": "rm_atacama",
        "file": "rm_atacama"
    },
    {
        "mapId": 151,
        "mapIdRoR": 10942,
        "enum": "rm_seize_the_mountain",
        "file": "rm_seize_the_mountain"
    },
    {
        "mapId": 152,
        "mapIdRoR": 10943,
        "file": "rm_crater",
        "enum": "rm_crater"
    },
    {
        "mapId": 153,
        "mapIdRoR": 10944,
        "enum": "rm_crossroads",
        "file": "rm_crossroads"
    },
    {
        "mapId": 154,
        "mapIdRoR": 10945,
        "enum": "rm_michi",
        "file": "rm_michi"
    },
    {
        "mapId": 155,
        "mapIdRoR": 10946,
        "enum": "rm_team_moats",
        "file": "rm_team_moats"
    },
    {
        "mapId": 156,
        "mapIdRoR": 10947,
        "enum": "rm_volcanic_island",
        "file": "rm_volcanic_island"
    },
    {
        "mapId": 157,
        "mapIdRoR": 10948,
        "enum": "rm_acclivity",
        "file": "rm_acclivity"
    },
    {
        "mapId": 158,
        "mapIdRoR": 10949,
        "enum": "rm_eruption",
        "file": "rm_eruption"
    },
    {
        "mapId": 159,
        "mapIdRoR": 10950,
        "enum": "rm_frigid_lake",
        "file": "rm_frigid_lake"
    },
    {
        "mapId": 160,
        "mapIdRoR": 10951,
        "enum": "rm_greenland",
        "file": "rm_greenland"
    },
    {
        "mapId": 161,
        "mapIdRoR": 10952,
        "enum": "rm_lowland",
        "file": "rm_lowland"
    },
    {
        "mapId": 162,
        "mapIdRoR": 10953,
        "enum": "rm_marketplace",
        "file": "rm_marketplace"
    },
    {
        "mapId": 163,
        "mapIdRoR": 10954,
        "enum": "rm_meadow",
        "file": "rm_meadow"
    },
    {
        "mapId": 164,
        "mapIdRoR": 10955,
        "enum": "rm_mountain_range",
        "file": "rm_mountain_range"
    },
    {
        "mapId": 165,
        "mapIdRoR": 10956,
        "enum": "rm_northern_isles",
        "file": "rm_northern_isles"
    },
    {
        "mapId": 166,
        "mapIdRoR": 10957,
        "enum": "rm_ring_fortress",
        "file": "rm_ring_fortress"
    },
    {
        "mapId": 167,
        "mapIdRoR": 10958,
        "enum": "rm_runestones",
        "file": "rm_runestones"
    },
    {
        "mapId": 168,
        "mapIdRoR": 10959,
        "enum": "rm_aftermath",
        "file": "rm_aftermath"
    },
    {
        "mapId": 169,
        "mapIdRoR": 10960,
        "enum": "rm_enclosed",
        "file": "rm_enclosed"
    },
    {
        "mapId": 170,
        "mapIdRoR": 10961,
        "enum": "rm_haboob",
        "file": "rm_haboob"
    },
    {
        "mapId": 171,
        "mapIdRoR": 10962,
        "enum": "rm_kawasan",
        "file": "rm_kawasan"
    },
    {
        "mapId": 172,
        "mapIdRoR": 10963,
        "enum": "rm_land_madness",
        "file": "rm_land_madness"
    },
    {
        "mapId": 173,
        "mapIdRoR": 10964,
        "enum": "rm_sacred_springs",
        "file": "rm_sacred_springs"
    },
    {
        "mapId": 174,
        "mapIdRoR": 10965,
        "enum": "rm_wade",
        "file": "rm_wade"
    },
    {
        "mapId": 175,
        "mapIdRoR": 10966,
        "enum": "rm_morass",
        "file": "rm_morass"
    },
    {
        "mapId": 176,
        "mapIdRoR": 10967,
        "enum": "rm_shoals",
        "file": "rm_shoals"
    }
];
