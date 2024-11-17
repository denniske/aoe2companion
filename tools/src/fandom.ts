import axios from "axios"
import { flatten } from 'lodash';
import * as console from 'console';

export const unitLineIds = [
    'ManAtArms',
    'LongSwordsman',
    'TwoHandedSwordsman',
    'Champion',
    'Pikeman',
    'Halberdier',
    'EagleWarrior',
    'EliteEagleWarrior',
    'Crossbowman',
    'Arbalester',
    'EliteSkirmisher',
    'ImperialSkirmisher',
    'HeavyCavalryArcher',
    'LightCavalry',
    'Hussar',
    'WingedHussar',
    'Cavalier',
    'Paladin',
    'Savar',
    'CamelScout',
    'HeavyCamelRider',
    'ImperialCamelRider',
    'EliteBattleElephant',
    'SiegeElephant',
    'CappedRam',
    'SiegeRam',
    'Onager',
    'SiegeOnager',
    'HeavyScorpion',
    'Houfnice',
    'WarGalley',
    'Galleon',
    'FireShip',
    'FastFireShip',
    'DemolitionShip',
    'HeavyDemolitionShip',
    'EliteCannonGalleon',
    'Ghulam',
    'ShrivamshaRider',
    'ChakramThrower',
    'Thirisadai',
    'UrumiSwordsman',
    'ArmoredElephant',
    'Ratha',
    'Obuch',
    'HussiteWagon',
    'Coustillier',
    'Serjeant',
    'FlemishMilitia',
    'TradeCart',
    'TradeCog',
    'FishingShip',
    'TransportShip',
    'Villager',
    'Missionary',
    'Monk',
    'DemolitionRaft',
    'FireGalley',
    'Galley',
    'CannonGalleon',
    'Arambai',
    'OrganGun',
    'Caravel',
    'SiegeTower',
    'Conquistador',
    'TurtleShip',
    'Longboat',
    'Janissary',
    'BallistaElephant',
    'FlamingCamel',
    'Petard',
    'Trebuchet',
    'BombardCannon',
    'Mangonel',
    'BatteringRam',
    'Scorpion',
    'HandCannoneer',
    'KarambitWarrior',
    'Gbeto',
    'ShotelWarrior',
    'Condottiero',
    'JaguarWarrior',
    'Berserk',
    'TeutonicKnight',
    'Samurai',
    'Huskarl',
    'ThrowingAxeman',
    'WoadRaider',
    'EagleScout',
    'Spearman',
    'Militia',
    'Keshik',
    'Leitis',
    'Konnik',
    'KonnikDismounted',
    'Boyar',
    'MagyarHuszar',
    'Tarkan',
    'Mameluke',
    'WarElephant',
    'Cataphract',
    'SteppeLancer',
    'BattleElephant',
    'CamelRider',
    'Knight',
    'XolotlWarrior',
    'ScoutCavalry',
    'Kipchak',
    'RattanArcher',
    'Genitour',
    'CamelArcher',
    'GenoeseCrossbowman',
    'ElephantArcher',
    'WarWagon',
    'Mangudai',
    'ChuKoNu',
    'Longbowman',
    'CavalryArcher',
    'Skirmisher',
    'Archer',
    'PlumedArcher',
    'Slinger',
    'Kamayuk',
    'Legionary',
    'Centurion',
    'Dromon',
    'CompositeBowman',
    'Monaspa',
    'WarriorPriest',
] as const;


const buildingIds = [
    'ArcheryRange',
    'Barracks',
    'Blacksmith',
    'BombardTower',
    'Castle',
    'Caravanserai',
    'Dock',
    'Donjon',
    'Farm',
    'Feitoria',
    'FishTrap',
    'Folwark',
    'FortifiedWall',
    'Gate',
    'GuardTower',
    'Harbor',
    'House',
    'Keep',
    'Krepost',
    'LumberCamp',
    'Market',
    'Mill',
    'MiningCamp',
    'Monastery',
    'Outpost',
    'PalisadeGate',
    'PalisadeWall',
    'SiegeWorkshop',
    'Stable',
    'StoneWall',
    'TownCenter',
    'University',
    'WatchTower',
    'Wonder',
    'FortifiedChurch',
    'MuleCart',
] as const;


const techIds = [
    'Ballistas',
    'Comitatenses',
    'Gambesons',
    'Counterweights',
    'Kshatriyas',
    'FrontierGuards',
    'MedicalCorps',
    'WootzSteel',
    'Paiks',
    'Mahayana',

    'BurgundianVineyards',
    'FlemishRevolution',
    'FirstCrusade',
    'Hauberk',
    'FeudalAge',
    'CastleAge',
    'ImperialAge',
    'BombardTower',
    'Keep',
    'GuardTower',
    'FortifiedWall',
    'Architecture',
    'ArrowSlits',
    'Banking',
    'Coinage',
    'Guilds',
    'HeatedShot',
    'Hoardings',
    'Masonry',
    'MurderHoles',
    'TownPatrol',
    'TownWatch',
    'SpiesTreason',
    'HorseCollar',
    'CropRotation',
    'Forging',
    'IronCasting',
    'BlastFurnace',
    'Arson',
    'ScaleMailArmor',
    'ChainMailArmor',
    'PlateMailArmor',
    'Squires',
    'Devotion',
    'Faith',
    'Heresy',
    'Conscription',
    'ThumbRing',
    'Ballistics',
    'PaddedArcherArmor',
    'LeatherArcherArmor',
    'RingArcherArmor',
    'Fletching',
    'BodkinArrow',
    'Bracer',
    'Chemistry',
    'Bloodlines',
    'ParthianTactics',
    'Husbandry',
    'ScaleBardingArmor',
    'ChainBardingArmor',
    'PlateBardingArmor',
    'Supplies',
    'SiegeEngineers',
    'Careening',
    'DryDock',
    'Shipwright',
    'Sanctity',
    'Redemption',
    'Atonement',
    'HerbalMedicine',
    'Fervor',
    'Illumination',
    'BlockPrinting',
    'Theocracy',
    'Caravan',
    'Gillnets',
    'Wheelbarrow',
    'HandCart',
    'HeavyPlow',
    'DoubleBitAxe',
    'BowSaw',
    'TwoManSaw',
    'StoneMining',
    'StoneShaftMining',
    'GoldMining',
    'GoldShaftMining',
    'Loom',
    'Sappers',
    'TreadmillCrane',

    'Atlatl',
    'Kasbah',
    'Yeomen',
    'Stirrups',
    'Howdah',
    'GreekFire',
    'Stronghold',
    'GreatWall',
    'SteppeHusbandry',
    'RoyalHeirs',
    'Chivalry',
    'Anarchy',
    'Marauders',
    'AndeanSling',
    'GrandTrunkRoad',
    'Pavise',
    'Yasama',
    'TuskSwords',
    'Eupseong',
    'HillForts',
    'CorvinianArmy',
    'Thalassocracy',
    'Tigui',
    'HulcheJavelineers',
    'Nomads',
    'Kamandaran',
    'Carrack',
    'Detinets',
    'Inquisition',
    'SilkArmor',
    'Ironclad',
    'Sipahi',
    'Chatras',
    'Chieftains',
    'WagenburgTactics',
    'SzlachtaPrivileges',
    'CilicianFleet',
    'SvanTowers',

    'Fereters',
    'AznauriCavalry',
    'LechiticLegacy',
    'HussiteReforms',
    'GarlandWars',
    'MaghrebiCamels',
    'Warwolf',
    'Bagains',
    'ManipurCavalry',
    'Logistica',
    'FurorCeltica',
    'Rocketry',
    'CumanMercenaries',
    'TorsionEngines',
    'BeardedAxe',
    'Perfusion',
    'Atheism',
    'FabricShields',
    'Shatagni',
    'SilkRoad',
    'Kataparuto',
    'DoubleCrossbow',
    'Shinkichon',
    'TowerShields',
    'RecurveBow',
    'ForcedLevy',
    'Farimba',
    'ElDorado',
    'Drill',
    'Citadels',
    'Arquebus',
    'Bimaristan',
    'Druzhina',
    'Supremacy',
    'TimuridSiegecraft',
    'Crenellations',
    'Artillery',
    'PaperMoney',
    'Bogsveigar',
] as const;


interface LinkObject {
    text: string;
    url: string;
}

async function getLinksAndTextUsingRegex(url: string): Promise<LinkObject[]> {
    const htmlSource = await axios.get(url).then(response => response.data);
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*?>(.*?)<\/a>/g;
    const links: LinkObject[] = [];
    let match;

    while ((match = linkRegex.exec(htmlSource)) !== null) {
        const linkObject: LinkObject = {
            text: match[3],
            url: match[2]
        };
        links.push(linkObject);
    }

    return links;
}

async function getFandomUrls(urls: string[], names: readonly string[]) {
    const allLinks = flatten(await Promise.all(urls.map(getLinksAndTextUsingRegex)));
    // console.log(allLinks);

    // for each name from names get the link or "missing"
    const links: { [key: string]: string } = {};
    for (const name of names) {
        const link = allLinks.find(link =>
            link.text
                .replace(/\s+/g, '')
                .replace(/'/g, '')
                .replace(/-/g, '')
                .toLowerCase() === name.toLowerCase());
        links[name] = link ? 'https://ageofempires.fandom.com' + link.url : "missing";
    }

    if (links['KonnikDismounted'] === 'missing') {
        links['KonnikDismounted'] = 'https://ageofempires.fandom.com/wiki/Konnik';
    }
    if (links['Ratha'] === 'missing') {
        links['Ratha'] = 'https://ageofempires.fandom.com/wiki/Ratha';
    }
    if (links['SpiesTreason'] === 'missing') {
        // Actually there are separate articles on fandom, but as Spies links to treason at the bottom it is fine
        links['SpiesTreason'] = 'https://ageofempires.fandom.com/wiki/Spies_(Age_of_Empires_II)';
    }
    if (links['FortifiedWall'] === 'missing') {
        links['FortifiedWall'] = 'https://ageofempires.fandom.com/wiki/Fortified_Wall_(Age_of_Empires_II)';
    }
    if (links['GuardTower'] === 'missing') {
        links['GuardTower'] = 'https://ageofempires.fandom.com/wiki/Guard_Tower_(Age_of_Empires_II)';
    }
    if (links['Keep'] === 'missing') {
        links['Keep'] = 'https://ageofempires.fandom.com/wiki/Keep_(Age_of_Empires_II)';
    }

    // console.log(links);

    // console log missing links
    const missingLinks = Object.entries(links).filter(([name, link]) => link === 'missing');
    // console.log(missingLinks);

    return links;
}

async function main() {

    const urls = {
        units: await getFandomUrls(['https://ageofempires.fandom.com/wiki/Unit_(Age_of_Empires_II)'], unitLineIds),
        buildings: await getFandomUrls(['https://ageofempires.fandom.com/wiki/Building_(Age_of_Empires_II)'], buildingIds),
        techs: await getFandomUrls(['https://ageofempires.fandom.com/wiki/Technology_(Age_of_Empires_II)', 'https://ageofempires.fandom.com/wiki/Unique_technology_(Age_of_Empires_II)'], techIds),
    };

    console.log(JSON.stringify(urls, null, 4));
}

main();
