import { Age, Civ, getCivMonkType, Other, Unit, UnitLine, unitLines } from '@nex/data';
import {ImageSourcePropType} from "react-native";


const otherIcons = {
    'Wood': require('../../assets/other/Wood.png'),
    'Food': require('../../assets/other/Food.png'),
    'Gold': require('../../assets/other/Gold.png'),
    'Stone': require('../../assets/other/Stone.png'),
    'BerryBush': require('../../assets/other/BerryBush.png'),
    'Cross': require('../../assets/other/Cross.png'),
    'Build': require('../../assets/other/Build.png'),
};


export function getOtherIcon(other: Other) {
    return otherIcons[other];
}

const ageIcons = {
    'DarkAge': require('../../assets/other/DarkAge.png'),
    'FeudalAge': require('../../assets/other/FeudalAgeFull.png'),
    'CastleAge': require('../../assets/other/CastleAge.png'),
    'ImperialAge': require('../../assets/other/ImperialAge.png'),
};


export function getAgeIcon(age: Age) {
    return ageIcons[age];
}

interface UnitIconDict {
    [unit: string]: ImageSourcePropType;
}

// Use .webp for smaller files later
const unitIcons: UnitIconDict = {
    'Centurion': require('../../assets/units/Centurion.png'),
    'Legionary': require('../../assets/units/Legionary.png'),
    'Dromon': require('../../assets/units/Dromon.png'),
    'Ghulam': require('../../assets/units/Ghulam.png'),
    'CamelScout': require('../../assets/units/CamelScout.png'),
    'ShrivamshaRider': require('../../assets/units/ShrivamshaRider.png'),
    'ChakramThrower': require('../../assets/units/ChakramThrower.png'),
    'Thirisadai': require('../../assets/units/Thirisadai.png'),
    'UrumiSwordsman': require('../../assets/units/UrumiSwordsman.png'),
    'ArmoredElephant': require('../../assets/units/ArmoredElephant.png'),
    'SiegeElephant': require('../../assets/units/SiegeElephant.png'),
    'Ratha': require('../../assets/units/Ratha.png'),

    'FireLancer': require('../../assets/units/FireLancer.png'),
    'EliteFireLancer': require('../../assets/units/EliteFireLancer.png'),
    'JianSwordsman': require('../../assets/units/JianSwordsman.png'),
    'RocketCart': require('../../assets/units/RocketCart.png'),
    'HeavyRocketCart': require('../../assets/units/HeavyRocketCart.png'),
    'CaoCao': require('../../assets/units/CaoCao.png'),
    'DragonShip': require('../../assets/units/DragonShip.png'),
    'LiuBei': require('../../assets/units/LiuBei.png'),
    'LouChuan': require('../../assets/units/LouChuan.png'),
    'SunJian': require('../../assets/units/SunJian.png'),

    'IronPagoda': require('../../assets/units/IronPagoda.png'),
    'LiaoDao': require('../../assets/units/LiaoDao.png'),
    'FireArcher': require('../../assets/units/FireArcher.png'),
    'TigerCavalry': require('../../assets/units/TigerCavalry.png'),
    'HeiGuangCavalry': require('../../assets/units/HeiGuangCavalry.png'),
    'HeavyHeiGuangCavalry': require('../../assets/units/HeavyHeiGuangCavalry.png'),
    'WhiteFeatherGuard': require('../../assets/units/WhiteFeatherGuard.png'),
    'Grenadier': require('../../assets/units/Grenadier.png'),
    'MountedTrebuchet': require('../../assets/units/MountedTrebuchet.png'),
    'TractionTrebuchet': require('../../assets/units/TractionTrebuchet.png'),
    'WarChariot': require('../../assets/units/WarChariot.png'),
    'XianbeiRaider': require('../../assets/units/XianbeiRaider.png'),

    'Savar': require('../../assets/units/Savar.png'),
    'CompositeBowman': require('../../assets/units/CompositeBowman.png'),
    'Monaspa': require('../../assets/units/Monaspa.png'),
    'WarriorPriest': require('../../assets/units/WarriorPriest.png'),
    'Obuch': require('../../assets/units/Obuch.png'),
    'HussiteWagon': require('../../assets/units/HussiteWagon.png'),
    'Houfnice': require('../../assets/units/Houfnice.png'),
    'WingedHussar': require('../../assets/units/WingedHussar.png'),
    'Coustillier': require('../../assets/units/Coustillier.png'),
    'Serjeant': require('../../assets/units/Serjeant.png'),
    'FlemishMilitia': require('../../assets/units/FlemishMilitia.png'),
    'Sheep': require('../../assets/units/Sheep.png'),
    'Boar': require('../../assets/units/Boar.png'),
    'Kamayuk': require('../../assets/units/Kamayuk.png'),
    'Slinger': require('../../assets/units/Slinger.png'),
    'PlumedArcher': require('../../assets/units/PlumedArcher.png'),
    'Archer': require('../../assets/units/Archer.png'),
    'Crossbowman': require('../../assets/units/Crossbowman.png'),
    'Arbalester': require('../../assets/units/Arbalester.png'),
    'Skirmisher': require('../../assets/units/Skirmisher.png'),
    'EliteSkirmisher': require('../../assets/units/EliteSkirmisher.png'),
    'ImperialSkirmisher': require('../../assets/units/ImperialSkirmisher.png'),
    'CavalryArcher': require('../../assets/units/CavalryArcher.png'),
    'HeavyCavalryArcher': require('../../assets/units/HeavyCavalryArcher.png'),
    'Longbowman': require('../../assets/units/Longbowman.png'),
    'ChuKoNu': require('../../assets/units/ChuKoNu.png'),
    'Mangudai': require('../../assets/units/Mangudai.png'),
    'WarWagon': require('../../assets/units/WarWagon.png'),
    'ElephantArcher': require('../../assets/units/ElephantArcher.png'),
    'EliteElephantArcher': require('../../assets/units/EliteElephantArcher.png'),
    'GenoeseCrossbowman': require('../../assets/units/GenoeseCrossbowman.png'),
    'CamelArcher': require('../../assets/units/CamelArcher.png'),
    'Genitour': require('../../assets/units/Genitour.png'),
    'RattanArcher': require('../../assets/units/RattanArcher.png'),
    'Kipchak': require('../../assets/units/Kipchak.png'),
    'ScoutCavalry': require('../../assets/units/ScoutCavalry.png'),
    'LightCavalry': require('../../assets/units/LightCavalry.png'),
    'Hussar': require('../../assets/units/Hussar.png'),
    'XolotlWarrior': require('../../assets/units/XolotlWarrior.png'),
    'Knight': require('../../assets/units/Knight.png'),
    'Cavalier': require('../../assets/units/Cavalier.png'),
    'Paladin': require('../../assets/units/Paladin.png'),
    'CamelRider': require('../../assets/units/CamelRider.png'),
    'HeavyCamelRider': require('../../assets/units/HeavyCamelRider.png'),
    'ImperialCamelRider': require('../../assets/units/ImperialCamelRider.png'),
    'BattleElephant': require('../../assets/units/BattleElephant.png'),
    'EliteBattleElephant': require('../../assets/units/EliteBattleElephant.png'),
    'SteppeLancer': require('../../assets/units/SteppeLancer.png'),
    'EliteSteppeLancer': require('../../assets/units/EliteSteppeLancer.png'),
    'Cataphract': require('../../assets/units/Cataphract.png'),
    'WarElephant': require('../../assets/units/WarElephant.png'),
    'Mameluke': require('../../assets/units/Mameluke.png'),
    'Tarkan': require('../../assets/units/Tarkan.png'),
    'MagyarHuszar': require('../../assets/units/MagyarHuszar.png'),
    'Boyar': require('../../assets/units/Boyar.png'),
    'Konnik': require('../../assets/units/Konnik.png'),
    'KonnikDismounted': require('../../assets/units/KonnikDismounted.png'),
    'Leitis': require('../../assets/units/Leitis.png'),
    'Keshik': require('../../assets/units/Keshik.png'),
    'Militia': require('../../assets/units/Militia.png'),
    'ManAtArms': require('../../assets/units/ManAtArms.png'),
    'LongSwordsman': require('../../assets/units/LongSwordsman.png'),
    'TwoHandedSwordsman': require('../../assets/units/TwoHandedSwordsman.png'),
    'Champion': require('../../assets/units/Champion.png'),
    'Spearman': require('../../assets/units/Spearman.png'),
    'Pikeman': require('../../assets/units/Pikeman.png'),
    'Halberdier': require('../../assets/units/Halberdier.png'),
    'EagleScout': require('../../assets/units/EagleScout.png'),
    'EagleWarrior': require('../../assets/units/EagleWarrior.png'),
    'EliteEagleWarrior': require('../../assets/units/EliteEagleWarrior.png'),
    'WoadRaider': require('../../assets/units/WoadRaider.png'),
    'ThrowingAxeman': require('../../assets/units/ThrowingAxeman.png'),
    'Huskarl': require('../../assets/units/Huskarl.png'),
    'Samurai': require('../../assets/units/Samurai.png'),
    'TeutonicKnight': require('../../assets/units/TeutonicKnight.png'),
    'Berserk': require('../../assets/units/Berserk.png'),
    'JaguarWarrior': require('../../assets/units/JaguarWarrior.png'),
    'Condottiero': require('../../assets/units/Condottiero.png'),
    'ShotelWarrior': require('../../assets/units/ShotelWarrior.png'),
    'Gbeto': require('../../assets/units/Gbeto.png'),
    'KarambitWarrior': require('../../assets/units/KarambitWarrior.png'),
    'HandCannoneer': require('../../assets/units/HandCannoneer.png'),
    'Scorpion': require('../../assets/units/Scorpion.png'),
    'HeavyScorpion': require('../../assets/units/HeavyScorpion.png'),
    'BatteringRam': require('../../assets/units/BatteringRam.png'),
    'CappedRam': require('../../assets/units/CappedRam.png'),
    'SiegeRam': require('../../assets/units/SiegeRam.png'),
    'Mangonel': require('../../assets/units/Mangonel.png'),
    'Onager': require('../../assets/units/Onager.png'),
    'SiegeOnager': require('../../assets/units/SiegeOnager.png'),
    'BombardCannon': require('../../assets/units/BombardCannon.png'),
    'Trebuchet': require('../../assets/units/Trebuchet.png'),
    'Petard': require('../../assets/units/Petard.png'),
    'FlamingCamel': require('../../assets/units/FlamingCamel.png'),
    'BallistaElephant': require('../../assets/units/BallistaElephant.png'),
    'Janissary': require('../../assets/units/Janissary.png'),
    'Longboat': require('../../assets/units/Longboat.png'),
    'TurtleShip': require('../../assets/units/TurtleShip.png'),
    'Conquistador': require('../../assets/units/Conquistador.png'),
    'SiegeTower': require('../../assets/units/SiegeTower.png'),
    'Caravel': require('../../assets/units/Caravel.png'),
    'OrganGun': require('../../assets/units/OrganGun.png'),
    'Arambai': require('../../assets/units/Arambai.png'),
    'Galley': require('../../assets/units/Galley.png'),
    'WarGalley': require('../../assets/units/WarGalley.png'),
    'Galleon': require('../../assets/units/Galleon.png'),
    'FireGalley': require('../../assets/units/FireGalley.png'),
    'FireShip': require('../../assets/units/FireShip.png'),
    'FastFireShip': require('../../assets/units/FastFireShip.png'),
    'DemolitionRaft': require('../../assets/units/DemolitionRaft.png'),
    'DemolitionShip': require('../../assets/units/DemolitionShip.png'),
    'HeavyDemolitionShip': require('../../assets/units/HeavyDemolitionShip.png'),
    'CannonGalleon': require('../../assets/units/CannonGalleon.png'),
    'EliteCannonGalleon': require('../../assets/units/EliteCannonGalleon.png'),
    'Monk': require('../../assets/units/Monk.png'),
    'MonkGeneric': require('../../assets/units/Monk.png'),
    'MonkTengri': require('../../assets/units/MonkTengri.png'),
    'MonkAfrican': require('../../assets/units/MonkAfrican.png'),
    'MonkBuddhist': require('../../assets/units/MonkBuddhist.png'),
    'MonkCatholic': require('../../assets/units/MonkCatholic.png'),
    'MonkHindu': require('../../assets/units/MonkHindu.png'),
    'MonkMuslim': require('../../assets/units/MonkMuslim.png'),
    'MonkNative': require('../../assets/units/MonkNative.png'),
    'MonkOrthodox': require('../../assets/units/MonkOrthodox.png'),
    'Missionary': require('../../assets/units/Missionary.png'),
    'TradeCart': require('../../assets/units/TradeCart.png'),
    'TradeCog': require('../../assets/units/TradeCog.png'),
    'FishingShip': require('../../assets/units/FishingShip.png'),
    'TransportShip': require('../../assets/units/TransportShip.png'),
    'Villager': require('../../assets/units/Villager.png'),
};

export function getUnitLineIcon(unitLine: UnitLine) {
    const unit = unitLines[unitLine].units[0] as Unit;
    return getUnitIcon(unit);
}

export function getEliteUniqueResearchIcon() {
    return require('../../assets/units/EliteUniqueResearch.png');
}

const playerColors = [
    'blue',
    'red',
    'green',
    'yellow',
    'teal',
    'purple',
    'grey',
    'orange',
];

export function getUnitIcon(unit: Unit, civ?: Civ) {
    if (unitIcons[unit] == null) return require('../../assets/units/EliteUniqueResearch.png');
    if (unit === 'Monk' && civ) {
        const monkType = getCivMonkType(civ);
        return unitIcons['Monk' + monkType];
    }
    return unitIcons[unit];
}
