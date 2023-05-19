import {sortBy} from "lodash";


export interface IMap {
    mapId: number;
    mapIdRoR: number;
    enum: string;
    file: string;
}

let maps: IMap[] = [
    {
        mapId: 9,
        mapIdRoR: null,
        enum: 'rm_arabia',
        file: 'rm_arabia',
    },
    {
        mapId: 10,
        mapIdRoR: null,
        enum: 'rm_archipelago',
        file: 'rm_archipelago',
    },
    {
        mapId: 11,
        mapIdRoR: null,
        enum: 'rm_baltic',
        file: 'rm_baltic',
    },
    {
        mapId: 12,
        mapIdRoR: null,
        enum: 'rm_black-forest',
        file: 'rm_black-forest',
    },
    {
        mapId: 13,
        mapIdRoR: null,
        enum: 'rm_coastal',
        file: 'rm_coastal',
    },
    {
        mapId: 14,
        mapIdRoR: null,
        enum: 'rm_continental',
        file: 'rm_continental',
    },
    {
        mapId: 15,
        mapIdRoR: null,
        enum: 'rm_crater-lake',
        file: 'rm_crater-lake',
    },
    {
        mapId: 16,
        mapIdRoR: null,
        enum: 'rm_fortress',
        file: 'rm_fortress',
    },
    {
        mapId: 17,
        mapIdRoR: null,
        enum: 'rm_gold-rush',
        file: 'rm_gold-rush',
    },
    {
        mapId: 18,
        mapIdRoR: null,
        enum: 'rm_highland',
        file: 'rm_highland',
    },
    {
        mapId: 19,
        mapIdRoR: null,
        enum: 'rm_islands',
        file: 'rm_islands',
    },
    {
        mapId: 20,
        mapIdRoR: null,
        enum: 'rm_mediterranean',
        file: 'rm_mediterranean',
    },
    {
        mapId: 21,
        mapIdRoR: null,
        enum: 'rm_migration',
        file: 'rm_migration',
    },
    {
        mapId: 22,
        mapIdRoR: null,
        enum: 'rm_rivers',
        file: 'rm_rivers',
    },
    {
        mapId: 23,
        mapIdRoR: null,
        enum: 'rm_team-islands',
        file: 'rm_team-islands',
    },
    {
        mapId: 24,
        mapIdRoR: null,
        enum: 'rm_full-random',
        file: 'rm_full-random',
    },
    {
        mapId: 25,
        mapIdRoR: null,
        enum: 'rm_scandinavia',
        file: 'rm_scandinavia',
    },
    {
        mapId: 26,
        mapIdRoR: null,
        enum: 'rm_mongolia',
        file: 'rm_mongolia',
    },
    {
        mapId: 27,
        mapIdRoR: null,
        enum: 'rm_yucatan',
        file: 'rm_yucatan',
    },
    {
        mapId: 28,
        mapIdRoR: null,
        enum: 'rm_salt-marsh',
        file: 'rm_salt-marsh',
    },
    {
        mapId: 29,
        mapIdRoR: null,
        enum: 'rm_arena',
        file: 'rm_arena',
    },
    {
        mapId: 31,
        mapIdRoR: null,
        enum: 'rm_oasis',
        file: 'rm_oasis',
    },
    {
        mapId: 32,
        mapIdRoR: null,
        enum: 'rm_ghost-lake',
        file: 'rm_ghost-lake',
    },
    {
        mapId: 33,
        mapIdRoR: null,
        enum: 'rm_nomad',
        file: 'rm_nomad',
    },
    {
        mapId: 49,
        mapIdRoR: null,
        enum: 'rwm_iberia',
        file: 'rwm_iberia',
    },
    {
        mapId: 50,
        mapIdRoR: null,
        enum: 'rwm_britain',
        file: 'rwm_britain',
    },
    {
        mapId: 51,
        mapIdRoR: null,
        enum: 'rwm_mideast',
        file: 'rwm_mideast',
    },
    {
        mapId: 52,
        mapIdRoR: null,
        enum: 'rwm_texas',
        file: 'rwm_texas',
    },
    {
        mapId: 53,
        mapIdRoR: null,
        enum: 'rwm_italy',
        file: 'rwm_italy',
    },
    {
        mapId: 54,
        mapIdRoR: null,
        enum: 'rwm_central_america',
        file: 'rwm_central_america',
    },
    {
        mapId: 55,
        mapIdRoR: null,
        enum: 'rwm_france',
        file: 'rwm_france',
    },
    {
        mapId: 56,
        mapIdRoR: null,
        enum: 'rwm_norse_lands',
        file: 'rwm_norse_lands',
    },
    {
        mapId: 57,
        mapIdRoR: null,
        enum: 'rwm_sea_of_japan',
        file: 'rwm_sea_of_japan',
    },
    {
        mapId: 58,
        mapIdRoR: null,
        enum: 'rwm_byzantium',
        file: 'rwm_byzantium',
    },
    {
        mapId: 59,
        mapIdRoR: null,
        enum: 'cm_generic',
        file: 'cm_generic',
    },
    {
        mapId: 60,
        mapIdRoR: null,
        enum: 'rm_random_land_map',
        file: 'rm_random_land_map',
    },
    {
        mapId: 62,
        mapIdRoR: null,
        enum: 'rwm_random_real_world_map',
        file: 'rwm_random_real_world_map',
    },
    {
        mapId: 63,
        mapIdRoR: null,
        enum: 'rm_blind_random',
        file: 'rm_blind_random',
    },
    {
        mapId: 67,
        mapIdRoR: null,
        enum: 'rm_acropolis',
        file: 'rm_acropolis',
    },
    {
        mapId: 68,
        mapIdRoR: null,
        enum: 'rm_budapest',
        file: 'rm_budapest',
    },
    {
        mapId: 69,
        mapIdRoR: null,
        enum: 'rm_cenotes',
        file: 'rm_cenotes',
    },
    {
        mapId: 70,
        mapIdRoR: null,
        enum: 'rm_city-of-lakes',
        file: 'rm_city-of-lakes',
    },
    {
        mapId: 71,
        mapIdRoR: null,
        enum: 'rm_golden-pit',
        file: 'rm_golden-pit',
    },
    {
        mapId: 72,
        mapIdRoR: null,
        enum: 'rm_hideout',
        file: 'rm_hideout',
    },
    {
        mapId: 73,
        mapIdRoR: null,
        enum: 'rm_hill-fort',
        file: 'rm_hill-fort',
    },
    {
        mapId: 74,
        mapIdRoR: null,
        enum: 'rm_lombardia',
        file: 'rm_lombardia',
    },
    {
        mapId: 75,
        mapIdRoR: null,
        enum: 'rm_steppe',
        file: 'rm_steppe',
    },
    {
        mapId: 76,
        mapIdRoR: null,
        enum: 'rm_valley',
        file: 'rm_valley',
    },
    {
        mapId: 77,
        mapIdRoR: null,
        enum: 'rm_megarandom',
        file: 'rm_megarandom',
    },
    {
        mapId: 78,
        mapIdRoR: null,
        enum: 'rm_hamburger',
        file: 'rm_hamburger',
    },
    {
        mapId: 79,
        mapIdRoR: null,
        enum: 'rm_ctr_random',
        file: 'rm_ctr_random',
    },
    {
        mapId: 80,
        mapIdRoR: null,
        enum: 'rm_ctr_monsoon',
        file: 'rm_ctr_monsoon',
    },
    {
        mapId: 81,
        mapIdRoR: null,
        enum: 'rm_ctr_pyramid-descent',
        file: 'rm_ctr_pyramid-descent',
    },
    {
        mapId: 82,
        mapIdRoR: null,
        enum: 'rm_ctr_spiral',
        file: 'rm_ctr_spiral',
    },
    {
        mapId: 83,
        mapIdRoR: null,
        enum: 'rm_kilimanjaro',
        file: 'rm_kilimanjaro',
    },
    {
        mapId: 84,
        mapIdRoR: null,
        enum: 'rm_mountain-pass',
        file: 'rm_mountain-pass',
    },
    {
        mapId: 85,
        mapIdRoR: null,
        enum: 'rm_nile-delta',
        file: 'rm_nile-delta',
    },
    {
        mapId: 86,
        mapIdRoR: null,
        enum: 'rm_serengeti',
        file: 'rm_serengeti',
    },
    {
        mapId: 87,
        mapIdRoR: null,
        enum: 'rm_socotra',
        file: 'rm_socotra',
    },
    {
        mapId: 88,
        mapIdRoR: null,
        enum: 'rwm_amazon',
        file: 'rwm_amazon',
    },
    {
        mapId: 89,
        mapIdRoR: null,
        enum: 'rwm_china',
        file: 'rwm_china',
    },
    {
        mapId: 90,
        mapIdRoR: null,
        enum: 'rwm_horn_of_africa',
        file: 'rwm_horn_of_africa',
    },
    {
        mapId: 91,
        mapIdRoR: null,
        enum: 'rwm_india',
        file: 'rwm_india',
    },
    {
        mapId: 92,
        mapIdRoR: null,
        enum: 'rwm_madagascar',
        file: 'rwm_madagascar',
    },
    {
        mapId: 93,
        mapIdRoR: null,
        enum: 'rwm_west_africa',
        file: 'rwm_west_africa',
    },
    {
        mapId: 94,
        mapIdRoR: null,
        enum: 'rwm_bohemia',
        file: 'rwm_bohemia',
    },
    {
        mapId: 95,
        mapIdRoR: null,
        enum: 'rwm_earth',
        file: 'rwm_earth',
    },
    {
        mapId: 96,
        mapIdRoR: null,
        enum: 'sm_canyons',
        file: 'sm_canyons',
    },
    {
        mapId: 97,
        mapIdRoR: null,
        enum: 'sm_enemy-archipelago',
        file: 'sm_enemy-archipelago',
    },
    {
        mapId: 98,
        mapIdRoR: null,
        enum: 'sm_enemy-islands',
        file: 'sm_enemy-islands',
    },
    {
        mapId: 99,
        mapIdRoR: null,
        enum: 'sm_far-out',
        file: 'sm_far-out',
    },
    {
        mapId: 100,
        mapIdRoR: null,
        enum: 'sm_front-line',
        file: 'sm_front-line',
    },
    {
        mapId: 101,
        mapIdRoR: null,
        enum: 'sm_inner-circle',
        file: 'sm_inner-circle',
    },
    {
        mapId: 102,
        mapIdRoR: null,
        enum: 'sm_motherland',
        file: 'sm_motherland',
    },
    {
        mapId: 103,
        mapIdRoR: null,
        enum: 'sm_open-plains',
        file: 'sm_open-plains',
    },
    {
        mapId: 104,
        mapIdRoR: null,
        enum: 'sm_ring-of-water',
        file: 'sm_ring-of-water',
    },
    {
        mapId: 105,
        mapIdRoR: null,
        enum: 'sm_snake-pit',
        file: 'sm_snake-pit',
    },
    {
        mapId: 106,
        mapIdRoR: null,
        enum: 'sm_the-eye',
        file: 'sm_the-eye',
    },
    {
        mapId: 107,
        mapIdRoR: null,
        enum: 'rwm_australia',
        file: 'rwm_australia',
    },
    {
        mapId: 108,
        mapIdRoR: null,
        enum: 'rwm_indochina',
        file: 'rwm_indochina',
    },
    {
        mapId: 109,
        mapIdRoR: null,
        enum: 'rwm_indonesia',
        file: 'rwm_indonesia',
    },
    {
        mapId: 110,
        mapIdRoR: null,
        enum: 'rwm_strait_of_malacca',
        file: 'rwm_strait_of_malacca',
    },
    {
        mapId: 111,
        mapIdRoR: null,
        enum: 'rwm_phillipines',
        file: 'rwm_phillipines',
    },
    {
        mapId: 112,
        mapIdRoR: null,
        enum: 'rm_bog-islands',
        file: 'rm_bog-islands',
    },
    {
        mapId: 113,
        mapIdRoR: null,
        enum: 'rm_mangrove-jungle',
        file: 'rm_mangrove-jungle',
    },
    {
        mapId: 114,
        mapIdRoR: null,
        enum: 'rm_pacific-islands',
        file: 'rm_pacific-islands',
    },
    {
        mapId: 115,
        mapIdRoR: null,
        enum: 'rm_sandbank',
        file: 'rm_sandbank',
    },
    {
        mapId: 116,
        mapIdRoR: null,
        enum: 'rm_water-nomad',
        file: 'rm_water-nomad',
    },
    {
        mapId: 117,
        mapIdRoR: null,
        enum: 'sm_jungle-islands',
        file: 'sm_jungle-islands',
    },
    {
        mapId: 118,
        mapIdRoR: null,
        enum: 'sm_holy-line',
        file: 'sm_holy-line',
    },
    {
        mapId: 119,
        mapIdRoR: null,
        enum: 'sm_border-stones',
        file: 'sm_border-stones',
    },
    {
        mapId: 120,
        mapIdRoR: null,
        enum: 'sm_yin-yang',
        file: 'sm_yin-yang',
    },
    {
        mapId: 121,
        mapIdRoR: null,
        enum: 'sm_jungle-lanes',
        file: 'sm_jungle-lanes',
    },
    {
        mapId: 122,
        mapIdRoR: null,
        enum: 'rm_alpine-lakes',
        file: 'rm_alpine-lakes',
    },
    {
        mapId: 123,
        mapIdRoR: null,
        enum: 'rm_bogland',
        file: 'rm_bogland',
    },
    {
        mapId: 124,
        mapIdRoR: null,
        enum: 'rm_mountain-ridge',
        file: 'rm_mountain-ridge',
    },
    {
        mapId: 125,
        mapIdRoR: null,
        enum: 'rm_ravines',
        file: 'rm_ravines',
    },
    {
        mapId: 126,
        mapIdRoR: null,
        enum: 'rm_wolf-hill',
        file: 'rm_wolf-hill',
    },
    {
        mapId: 130,
        mapIdRoR: null,
        enum: 'sm_snake-forest',
        file: 'sm_snake-forest',
    },
    {
        mapId: 132,
        mapIdRoR: null,
        enum: 'rwm_antarctica',
        file: 'rwm_antarctica',
    },
    {
        mapId: 133,
        mapIdRoR: null,
        enum: 'rwm_aral_sea',
        file: 'rwm_aral_sea',
    },
    {
        mapId: 134,
        mapIdRoR: null,
        enum: 'rwm_black_sea',
        file: 'rwm_black_sea',
    },
    {
        mapId: 135,
        mapIdRoR: null,
        enum: 'rwm_caucasus',
        file: 'rwm_caucasus',
    },
    {
        mapId: 136,
        mapIdRoR: null,
        enum: 'rwm_caucasus',
        file: 'rwm_caucasus',
    },
    {
        mapId: 137,
        mapIdRoR: null,
        enum: 'cm_generic',
        file: 'cm_generic',
    },
    {
        mapId: 139,
        mapIdRoR: null,
        enum: 'rm_golden-swamp',
        file: 'rm_golden-swamp',
    },
    {
        mapId: 140,
        mapIdRoR: null,
        enum: 'rm_four-lakes',
        file: 'rm_four-lakes',
    },
    {
        mapId: 141,
        mapIdRoR: null,
        enum: 'rm_land_nomad',
        file: 'rm_land_nomad',
    },
    {
        mapId: 142,
        mapIdRoR: null,
        enum: 'br_battle_on_the_ice',
        file: 'br_battle_on_the_ice',
    },
    {
        mapId: 143,
        mapIdRoR: null,
        enum: 'br_el_dorado',
        file: 'br_el_dorado',
    },
    {
        mapId: 144,
        mapIdRoR: null,
        enum: 'br_fall_of_axum',
        file: 'br_fall_of_axum',
    },
    {
        mapId: 145,
        mapIdRoR: null,
        enum: 'br_fall_of_rome',
        file: 'br_fall_of_rome',
    },
    {
        mapId: 146,
        mapIdRoR: null,
        enum: 'br_the_majapahit_empire',
        file: 'br_the_majapahit_empire',
    },
    {
        mapId: 147,
        mapIdRoR: null,
        enum: 'rm_amazon_tunnels',
        file: 'rm_amazon_tunnels',
    },
    {
        mapId: 148,
        mapIdRoR: null,
        enum: 'rm_coastal_forest',
        file: 'rm_coastal_forest',
    },
    {
        mapId: 149,
        mapIdRoR: null,
        enum: 'rm_african_clearing',
        file: 'rm_african_clearing',
    },
    {
        mapId: 150,
        mapIdRoR: null,
        enum: 'rm_atacama',
        file: 'rm_atacama',
    },
    {
        mapId: 152,
        mapIdRoR: null,
        file: 'rm_crater',
        enum: 'rm_crater',
    },
    {
        mapId: 151,
        mapIdRoR: null,
        enum: 'rm_seize_the_mountain',
        file: 'rm_seize_the_mountain',
    },
    {
        mapId: 153,
        mapIdRoR: null,
        enum: 'rm_crossroads',
        file: 'rm_crossroads',
    },
    {
        mapId: 154,
        mapIdRoR: null,
        enum: 'rm_michi',
        file: 'rm_michi',
    },
    {
        mapId: 155,
        mapIdRoR: null,
        enum: 'rm_team_moats',
        file: 'rm_team_moats',
    },
    {
        mapId: 156,
        mapIdRoR: null,
        enum: 'rm_volcanic_island',
        file: 'rm_volcanic_island',
    },
    {
        mapId: 157,
        mapIdRoR: null,
        enum: 'rm_acclivity',
        file: 'rm_acclivity',
    },
    {
        mapId: 158,
        mapIdRoR: null,
        enum: 'rm_eruption',
        file: 'rm_eruption',
    },
    {
        mapId: 159,
        mapIdRoR: null,
        enum: 'rm_frigid_lake',
        file: 'rm_frigid_lake',
    },
    {
        mapId: 160,
        mapIdRoR: null,
        enum: 'rm_greenland',
        file: 'rm_greenland',
    },
    {
        mapId: 161,
        mapIdRoR: null,
        enum: 'rm_lowland',
        file: 'rm_lowland',
    },
    {
        mapId: 162,
        mapIdRoR: null,
        enum: 'rm_marketplace',
        file: 'rm_marketplace',
    },
    {
        mapId: 163,
        mapIdRoR: null,
        enum: 'rm_meadow',
        file: 'rm_meadow',
    },
    {
        mapId: 164,
        mapIdRoR: null,
        enum: 'rm_mountain_range',
        file: 'rm_mountain_range',
    },
    {
        mapId: 165,
        mapIdRoR: null,
        enum: 'rm_northern_isles',
        file: 'rm_northern_isles',
    },
    {
        mapId: 166,
        mapIdRoR: null,
        enum: 'rm_ring_fortress',
        file: 'rm_ring_fortress',
    },
    {
        mapId: 167,
        mapIdRoR: null,
        enum: 'rm_runestones',
        file: 'rm_runestones',
    },
    {
        mapId: 168,
        mapIdRoR: null,
        enum: 'rm_aftermath',
        file: 'rm_aftermath',
    },
    {
        mapId: 169,
        mapIdRoR: null,
        enum: 'rm_enclosed',
        file: 'rm_enclosed',
    },
    {
        mapId: 170,
        mapIdRoR: null,
        enum: 'rm_haboob',
        file: 'rm_haboob',
    },
    {
        mapId: 171,
        mapIdRoR: null,
        enum: 'rm_kawasan',
        file: 'rm_kawasan',
    },
    {
        mapId: 172,
        mapIdRoR: null,
        enum: 'rm_land_madness',
        file: 'rm_land_madness',
    },
    {
        mapId: 173,
        mapIdRoR: null,
        enum: 'rm_sacred_springs',
        file: 'rm_sacred_springs',
    },
    {
        mapId: 174,
        mapIdRoR: null,
        enum: 'rm_wade',
        file: 'rm_wade',
    },
    {
        mapId: 175,
        mapIdRoR: null,
        enum: 'rm_morass',
        file: 'rm_morass',
    },
    {
        mapId: 176,
        mapIdRoR: null,
        enum: 'rm_shoals',
        file: 'rm_shoals',
    },
];

const mappingRoR = {
    "Arabia": {
        "1": 9,
        "2": 10875
    },
    "Archipelago": {
        "1": 10,
        "2": 10876
    },
    "Baltic": {
        "1": 11,
        "2": 10877
    },
    "BlackForest": {
        "1": 12,
        "2": 10878
    },
    "Coastal": {
        "1": 13,
        "2": 10879
    },
    "Continental": {
        "1": 14,
        "2": 10880
    },
    "CraterLake": {
        "1": 15,
        "2": 10881
    },
    "Fortress": {
        "1": 16,
        "2": 10882
    },
    "GoldRush": {
        "1": 17,
        "2": 10883
    },
    "Highland": {
        "1": 18,
        "2": 10884
    },
    "Islands": {
        "1": 19,
        "2": 10885
    },
    "Mediterranean": {
        "1": 20,
        "2": 10886
    },
    "Migration": {
        "1": 21,
        "2": 10887
    },
    "Rivers": {
        "1": 22,
        "2": 10888
    },
    "TeamIslands": {
        "1": 23,
        "2": 10889
    },
    "Scandanavia": {
        "1": 25,
        "2": 10891
    },
    "Mongolia": {
        "1": 26,
        "2": 10892
    },
    "Yucatan": {
        "1": 27,
        "2": 10894
    },
    "SaltMarsh": {
        "1": 28,
        "2": 10893
    },
    "Arena": {
        "1": 29,
        "2": 10895
    },
    "Oasis": {
        "1": 31,
        "2": 10897
    },
    "GhostLake": {
        "1": 32,
        "2": 10898
    },
    "Nomad": {
        "1": 33,
        "2": 10901
    },
    "Canals": {
        "1": 34,
        "2": 10985
    },
    "Capricious": {
        "1": 35,
        "2": 10986
    },
    "Dingos": {
        "1": 36,
        "2": 10987
    },
    "Graveyards": {
        "1": 37,
        "2": 10988
    },
    "Metropolis": {
        "1": 38,
        "2": 10989
    },
    "Moats": {
        "1": 155,
        "2": 10946
    },
    "ParadiseIsland": {
        "1": 40,
        "2": 10991
    },
    "Pilgrims": {
        "1": 41,
        "2": 10992
    },
    "Prairie": {
        "1": 42,
        "2": 10993
    },
    "Seasons": {
        "1": 43,
        "2": 10994
    },
    "SherwoodForest": {
        "1": 44,
        "2": 10995
    },
    "SherwoodHeroes": {
        "1": 45,
        "2": 10996
    },
    "Shipwreck": {
        "1": 46,
        "2": 10997
    },
    "TeamGlaciers": {
        "1": 47,
        "2": 10998
    },
    "TheUnknown": {
        "1": 48,
        "2": 10999
    },
    "RealWorldSpain": {
        "1": 49,
        "2": 13544
    },
    "RealWorldEngland": {
        "1": 50,
        "2": 13545
    },
    "RealWorldMideast": {
        "1": 51,
        "2": 13546
    },
    "RealWorldTexas": {
        "1": 52,
        "2": 13547
    },
    "RealWorldItaly": {
        "1": 53,
        "2": 13548
    },
    "RealWorldCaribbean": {
        "1": 54,
        "2": 13549
    },
    "RealWorldFrance": {
        "1": 55,
        "2": 13550
    },
    "RealWorldJutland": {
        "1": 56,
        "2": 13551
    },
    "RealWorldNippon": {
        "1": 57,
        "2": 13552
    },
    "RealWorldByzantium": {
        "1": 58,
        "2": 13553
    },
    "Acropolis": {
        "1": 67,
        "2": 10914
    },
    "Budapest": {
        "1": 68,
        "2": 10915
    },
    "Cenotes": {
        "1": 69,
        "2": 10916
    },
    "Cityoflakes": {
        "1": 70,
        "2": 10917
    },
    "Goldenpit": {
        "1": 71,
        "2": 10918
    },
    "Hideout": {
        "1": 72,
        "2": 10919
    },
    "Hillfort": {
        "1": 73,
        "2": 10920
    },
    "Lombardia": {
        "1": 74,
        "2": 10921
    },
    "Steppe": {
        "1": 75,
        "2": 10922
    },
    "Valley": {
        "1": 76,
        "2": 10923
    },
    "Megarandom": {
        "1": 77,
        "2": 10924
    },
    "Hamburger": {
        "1": 78,
        "2": 10925
    },
    "CtrRandom": {
        "1": 79,
        "2": 10926
    },
    "CtrMonsoon": {
        "1": 80,
        "2": 10927
    },
    "CtrPyramidDescent": {
        "1": 81,
        "2": 10928
    },
    "CtrSpiral": {
        "1": 82,
        "2": 10929
    },
    "Kilimanjaro": {
        "1": 83,
        "2": -2
    },
    "MountainPass": {
        "1": 84,
        "2": -2
    },
    "NileDelta": {
        "1": 85,
        "2": -2
    },
    "Serengeti": {
        "1": 86,
        "2": -2
    },
    "Socotra": {
        "1": 87,
        "2": -2
    },
    "RealWorldAmazon": {
        "1": 88,
        "2": -2
    },
    "RealWorldChina": {
        "1": 89,
        "2": -2
    },
    "RealWorldHornOfAfrica": {
        "1": 90,
        "2": -2
    },
    "RealWorldIndia": {
        "1": 91,
        "2": -2
    },
    "RealWorldMadagascar": {
        "1": 92,
        "2": -2
    },
    "RealWorldWestAfrica": {
        "1": 93,
        "2": -2
    },
    "RealWorldBohemia": {
        "1": 94,
        "2": -2
    },
    "RealWorldEarth": {
        "1": 95,
        "2": -2
    },
    "SpecialMapCanyons": {
        "1": 96,
        "2": -2
    },
    "SpecialMapArchipelago": {
        "1": 97,
        "2": -2
    },
    "SpecialMapEnemyIslands": {
        "1": 98,
        "2": -2
    },
    "SpecialMapFarOut": {
        "1": 99,
        "2": -2
    },
    "SpecialMapFrontLine": {
        "1": 100,
        "2": -2
    },
    "SpecialMapInnerCircle": {
        "1": 101,
        "2": -2
    },
    "SpecialMapMotherland": {
        "1": 102,
        "2": -2
    },
    "SpecialMapOpenPlains": {
        "1": 103,
        "2": -2
    },
    "SpecialMapRingOfWater": {
        "1": 104,
        "2": -2
    },
    "SpecialMapSnakePit": {
        "1": 105,
        "2": -2
    },
    "SpecialMapTheEye": {
        "1": 106,
        "2": -2
    },
    "RealWorldAustralia": {
        "1": 107,
        "2": -2
    },
    "RealWorldIndochina": {
        "1": 108,
        "2": -2
    },
    "RealWorldIndonesia": {
        "1": 109,
        "2": -2
    },
    "RealWorldMalacca": {
        "1": 110,
        "2": -2
    },
    "RealWorldPhilippines": {
        "1": 111,
        "2": -2
    },
    "BogIslands": {
        "1": 112,
        "2": -2
    },
    "MangroveJungle": {
        "1": 113,
        "2": -2
    },
    "PacificIslands": {
        "1": 114,
        "2": -2
    },
    "Sandbank": {
        "1": 115,
        "2": -2
    },
    "WaterNomad": {
        "1": 116,
        "2": -2
    },
    "SpecialMapJungleIslands": {
        "1": 117,
        "2": -2
    },
    "SpecialMapHolyLine": {
        "1": 118,
        "2": -2
    },
    "SpecialMapBorderStones": {
        "1": 119,
        "2": -2
    },
    "SpecialMapYinYang": {
        "1": 120,
        "2": -2
    },
    "SpecialMapJungleLanes": {
        "1": 121,
        "2": -2
    },
    "AlpineLakes": {
        "1": 122,
        "2": -2
    },
    "Bogland": {
        "1": 123,
        "2": -2
    },
    "MountainRidge": {
        "1": 124,
        "2": -2
    },
    "Ravines": {
        "1": 125,
        "2": -2
    },
    "WolfHill": {
        "1": 126,
        "2": -2
    },
    "SwirlingRiverSpecial": {
        "1": 127,
        "2": -2
    },
    "TwinForestsSpecial": {
        "1": 128,
        "2": -2
    },
    "JourneySouthSpecial": {
        "1": 129,
        "2": -2
    },
    "SnakeForestSpecial": {
        "1": 130,
        "2": -2
    },
    "SprawlingStreamsSpecial": {
        "1": 131,
        "2": -2
    },
    "RealWorldAntarctica": {
        "1": 132,
        "2": -2
    },
    "RealWorldAralSea": {
        "1": 133,
        "2": -2
    },
    "RealWorldBlackSea": {
        "1": 134,
        "2": -2
    },
    "RealWorldCaucasus": {
        "1": 135,
        "2": -2
    },
    "RealWorldSiberia": {
        "1": 136,
        "2": -2
    },
    "GoldenSwamp": {
        "1": 139,
        "2": 10930
    },
    "FourLakes": {
        "1": 140,
        "2": 10931
    },
    "LandNomad": {
        "1": 141,
        "2": 10932
    },
    "BattleOnTheIce": {
        "1": 142,
        "2": 10933
    },
    "ElDorado": {
        "1": 143,
        "2": 10934
    },
    "FallOfAxum": {
        "1": 144,
        "2": 10935
    },
    "FallOfRome": {
        "1": 145,
        "2": 10936
    },
    "TheMajapahitEmpire": {
        "1": 146,
        "2": 10937
    },
    "AmazonTunnel": {
        "1": 147,
        "2": 10938
    },
    "CoastalForest": {
        "1": 148,
        "2": 10939
    },
    "AfricanClearing": {
        "1": 149,
        "2": 10940
    },
    "Atacama": {
        "1": 150,
        "2": 10941
    },
    "SeizeTheMountain": {
        "1": 151,
        "2": 10942
    },
    "Crater": {
        "1": 152,
        "2": 10943
    },
    "Crossroads": {
        "1": 153,
        "2": 10944
    },
    "Michi": {
        "1": 154,
        "2": 10945
    },
    "VolcanicIsland": {
        "1": 156,
        "2": 10947
    },
    "Acclivity": {
        "1": 157,
        "2": 10948
    },
    "Eruption": {
        "1": 158,
        "2": 10949
    },
    "FrigidLake": {
        "1": 159,
        "2": 10950
    },
    "Greenland": {
        "1": 160,
        "2": 10951
    },
    "Lowland": {
        "1": 161,
        "2": 10952
    },
    "Marketplace": {
        "1": 162,
        "2": 10953
    },
    "Meadow": {
        "1": 163,
        "2": 10954
    },
    "MountainRange": {
        "1": 164,
        "2": 10955
    },
    "NorthernIsles": {
        "1": 165,
        "2": 10956
    },
    "RingFortress": {
        "1": 166,
        "2": 10957
    },
    "Runestones": {
        "1": 167,
        "2": 10958
    },
    "Aftermath": {
        "1": 168,
        "2": 10959
    },
    "Enclosed": {
        "1": 169,
        "2": 10960
    },
    "Haboob": {
        "1": 170,
        "2": 10961
    },
    "Kawasan": {
        "1": 171,
        "2": 10962
    },
    "LandMadness": {
        "1": 172,
        "2": 10963
    },
    "SacredSprings": {
        "1": 173,
        "2": 10964
    },
    "Wade": {
        "1": 174,
        "2": 10965
    },
    "Morass": {
        "1": 175,
        "2": 10966
    },
    "Shoals": {
        "1": 176,
        "2": 10967
    }
};

const mappingRoR2 = {
    "Alliance": {
        "1": -1,
        "2": 301000
    },
    "Citadel": {
        "1": -1,
        "2": 301001
    },
    "Clearing": {
        "1": -1,
        "2": 301002
    },
    "coastal": {
        "1": -1,
        "2": 301003
    },
    "continental": {
        "1": -1,
        "2": 301004
    },
    "Darkforest": {
        "1": -1,
        "2": 301005
    },
    "Desertridge": {
        "1": -1,
        "2": 301006
    },
    "Goldmountain": {
        "1": -1,
        "2": 301007
    },
    "highland": {
        "1": -1,
        "2": 301008
    },
    "Hillcountry": {
        "1": -1,
        "2": 301009
    },
    "Inland": {
        "1": -1,
        "2": 301010
    },
    "Insideout": {
        "1": -1,
        "2": 301011
    },
    "landnomad": {
        "1": -1,
        "2": 301012
    },
    "Largeislands": {
        "1": -1,
        "2": 301013
    },
    "mediterranean": {
        "1": -1,
        "2": 301014
    },
    "megarandom": {
        "1": -1,
        "2": 301015
    },
    "Muddywaters": {
        "1": -1,
        "2": 301016
    },
    "Narrows": {
        "1": -1,
        "2": 301017
    },
    "nomad": {
        "1": -1,
        "2": 301018
    },
    "oasis": {
        "1": -1,
        "2": 301019
    },
    "Oceanchannel": {
        "1": -1,
        "2": 301020
    },
    "Oceanring": {
        "1": -1,
        "2": 301021
    },
    "Plateaus": {
        "1": -1,
        "2": 301022
    },
    "Rivercrossing": {
        "1": -1,
        "2": 301023
    },
    "rivers": {
        "1": -1,
        "2": 301024
    },
    "Sahara": {
        "1": -1,
        "2": 301025
    },
    "Smallislands": {
        "1": -1,
        "2": 301026
    },
    "Twinsettlements": {
        "1": -1,
        "2": 301027
    }
};




let missing = [];

for (const key of Object.keys(mappingRoR)) {
    const mappingRoRValue = (mappingRoR as any)[key];
    const map = maps.find(map => map.mapId === mappingRoRValue["1"]);
    if (map == null) {
        // console.log(key, mappingRoRValue);

        // missing.push({
        //     "id": mappingRoRValue["1"],
        //     "string": key,
        // });

        maps.push({
            mapId: mappingRoRValue["1"],
            mapIdRoR: mappingRoRValue["2"],
            enum: key,
            file: key,
        })

        continue;
    }
    map.mapIdRoR = mappingRoRValue["2"];
}


for (const key of Object.keys(mappingRoR2)) {
    const mappingRoRValue = (mappingRoR2 as any)[key];

    missing.push({
        "id": mappingRoRValue["2"],
        "string": key,
    });

    maps.push({
        mapId: mappingRoRValue["1"],
        mapIdRoR: mappingRoRValue["2"],
        enum: key,
        file: key,
    })
}

console.log(JSON.stringify(sortBy(maps, m => m.mapId), null, 4));
console.log(JSON.stringify(missing, null, 4));
