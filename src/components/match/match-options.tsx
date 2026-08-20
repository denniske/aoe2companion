import React from 'react';
import { View } from 'react-native';
import { IMatchNew } from '@app/api/helper/api.types';
import { Text } from '@app/components/text';
import { useTranslation } from '@app/helper/translate';
import { useAppTheme } from '@app/theming';
import { Card } from '@app/components/card';
import { appConfig } from '@nex/dataset';
import { Image } from '@/src/components/uniwind/image';
import { faCheckSquare, faSquare } from '@fortawesome/sharp-regular-svg-icons';
import { Icon } from '@app/components/icon';

interface Props {
    match: IMatchNew;
}

interface CheckRowProps {
    checked: boolean | undefined;
    label: string | undefined;
}

// The label wraps (German compounds such as "Vollständiger Technologiebaum" run
// to two lines), so the row is top-aligned. That would leave the 14px box
// hanging above the first line, which is 20px tall -- centre it in a box of
// that height so it lines up with the text either way.
function CheckRow({ checked, label }: CheckRowProps) {
    return (
        <View className="flex-row items-start gap-1">
            <View className="h-5 justify-center">
                <Icon icon={checked ? faCheckSquare : faSquare} size={14} />
            </View>
            <Text className="flex-1">{label}</Text>
        </View>
    );
}

export default function MatchOptions(props: Props) {
    const { match } = props;
    const getTranslation = useTranslation();
    const theme = useAppTheme();

    return (
        <Card direction="vertical">
            {appConfig.game === 'aoe4' && (
                <View className="flex-col gap-1">
                    <View className="flex-row gap-1">
                        <Text className="w-[180px] flex-none">{getTranslation('match.winConditions')}:</Text>
                        <Text className="flex-1">{match.winConditionsName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[180px] flex-none">{getTranslation('match.mapSize')}:</Text>
                        <Text className="flex-1">{match.mapSizeName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[180px] flex-none">{getTranslation('match.biome')}:</Text>
                        <Text className="flex-1">{match.biomeName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[180px] flex-none">{getTranslation('match.startingResources')}:</Text>
                        <Text className="flex-1">{match.startingResourcesName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[180px] flex-none">{getTranslation('match.startingAge')}:</Text>
                        <Text className="flex-1">{match.startingAgeName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[180px] flex-none">{getTranslation('match.mapState')}:</Text>
                        <Text className="flex-1">{match.mapStateName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[180px] flex-none">{getTranslation('match.cheats')}:</Text>
                        <Text className="flex-1">{getTranslation(match.cheats ? 'common.yes' : 'common.no')}</Text>
                    </View>
                </View>
            )}

            {appConfig.game === 'aoe2' && (
                <View className="flex-col gap-1">
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[50%] flex-none ml-5">{getTranslation('match.gameMode')}:</Text>
                        <Text className="flex-1 -ml-5">{match.gameModeName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[50%] flex-none ml-5">{getTranslation('match.map')}:</Text>
                        <Text className="flex-1 -ml-5">{match.mapName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[50%] flex-none ml-5">{getTranslation('match.mapsize')}:</Text>
                        <Text className="flex-1 -ml-5">{match.mapSizeName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Image source={require('../../../assets/explorer/match-icons/difficulty.png')} className="w-4 h-4" />
                        <Text className="w-[50%] flex-none">{getTranslation('match.aidifficulty')}:</Text>
                        <Text className="flex-1 -ml-5">{match.difficultyName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Image source={require('../../../assets/explorer/match-icons/resources.png')} className="w-4 h-4" />
                        <Text className="w-[50%] flex-none">{getTranslation('match.resources')}:</Text>
                        <Text className="flex-1 -ml-5">{match.resourcesName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Image source={require('../../../assets/explorer/match-icons/population.png')} className="w-4 h-4" />
                        <Text className="w-[50%] flex-none">{getTranslation('match.population')}:</Text>
                        <Text className="flex-1 -ml-5">{match.population}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Image source={require('../../../assets/explorer/match-icons/speed.png')} className="w-4 h-4" />
                        <Text className="w-[50%] flex-none">{getTranslation('match.gamespeed')}:</Text>
                        <Text className="flex-1 -ml-5">{match.speedName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Image source={require('../../../assets/explorer/match-icons/visibility.png')} className="w-4 h-4" />
                        <Text className="w-[50%] flex-none">{getTranslation('match.revealmap')}:</Text>
                        <Text className="flex-1 -ml-5">{match.revealMapName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Image source={require('../../../assets/explorer/match-icons/age.png')} className="w-4 h-4" />
                        <Text className="w-[50%] flex-none">{getTranslation('match.startingage')}:</Text>
                        <Text className="flex-1 -ml-5">{match.startingAgeName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Image source={require('../../../assets/explorer/match-icons/age.png')} className="w-4 h-4" />
                        <Text className="w-[50%] flex-none">{getTranslation('match.endingage')}:</Text>
                        <Text className="flex-1 -ml-5">{match.endingAgeName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Image source={require('../../../assets/explorer/match-icons/treaty.png')} className="w-4 h-4" />
                        <Text className="w-[50%] flex-none">{getTranslation('match.treatylength')}:</Text>
                        <Text className="flex-1 -ml-5">{match.treatyLength} minutes</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Image source={require('../../../assets/explorer/match-icons/victory.png')} className="w-4 h-4" />
                        <Text className="w-[50%] flex-none">{getTranslation('match.victory')}:</Text>
                        <Text className="flex-1 -ml-5">{match.victoryName}</Text>
                    </View>

                    <View className="flex-row gap-1 mt-2">
                        <View className="flex-col gap-1 flex-1 min-w-0">
                            <Text className="mb-1">{getTranslation('match.teamSettings')}</Text>
                            <CheckRow checked={match.lockTeams} label={getTranslation('match.lockTeams')} />
                            <CheckRow checked={match.teamTogether} label={getTranslation('match.teamTogether')} />
                            <CheckRow checked={match.teamPositions} label={getTranslation('match.teamPositions')} />
                            <CheckRow checked={match.sharedExploration} label={getTranslation('match.sharedExploration')} />
                        </View>
                        <View className="flex-col gap-1 flex-1 min-w-0">
                            <Text className="mb-1">{getTranslation('match.advancedSettings')}</Text>
                            <CheckRow checked={match.lockSpeed} label={getTranslation('match.lockSpeed')} />
                            <CheckRow checked={match.allowCheats} label={getTranslation('match.allowCheats')} />
                            <CheckRow checked={match.turboMode} label={getTranslation('match.turboMode')} />
                            <CheckRow checked={match.fullTechTree} label={getTranslation('match.fullTechTree')} />
                            <CheckRow checked={match.empireWarsMode} label={getTranslation('match.empireWarsMode')} />
                            <CheckRow checked={match.suddenDeathMode} label={getTranslation('match.suddenDeathMode')} />
                            <CheckRow checked={match.regicideMode} label={getTranslation('match.regicideMode')} />
                            <CheckRow checked={match.antiquityMode} label={getTranslation('match.antiquityMode')} />
                            <CheckRow checked={match.recordGame} label={getTranslation('match.recordGame')} />
                        </View>
                    </View>
                </View>
            )}
        </Card>
    );
}
