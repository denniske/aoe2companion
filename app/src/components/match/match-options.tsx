import React from 'react';
import { View } from 'react-native';
import { IMatchNew } from '@app/api/helper/api.types';
import { Text } from '@app/components/text';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from '@app/helper/translate';
import { useAppTheme } from '@app/theming';
import { Card } from '@app/components/card';
import { appConfig } from '@nex/dataset';
import { Image } from 'expo-image';

interface Props {
    match: IMatchNew;
}

export default function MatchOptions(props: Props) {
    const { match } = props;
    const getTranslation = useTranslation();
    const theme = useAppTheme();

    return (
        <Card direction="vertical">
            {appConfig.game === 'aoe4' && (
                <View className="flex-col gap-1">
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[180px]">{getTranslation('match.winConditions')}:</Text>
                        <Text>{match.winConditionsName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[180px]">{getTranslation('match.mapSize')}:</Text>
                        <Text>{match.mapSizeName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[180px]">{getTranslation('match.biome')}:</Text>
                        <Text>{match.biomeName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[180px]">{getTranslation('match.startingResources')}:</Text>
                        <Text>{match.startingResourcesName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[180px]">{getTranslation('match.startingAge')}:</Text>
                        <Text>{match.startingAgeName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[180px]">{getTranslation('match.mapState')}:</Text>
                        <Text>{match.mapStateName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[180px]">{getTranslation('match.cheats')}:</Text>
                        <Text>{match.cheats ? 'Yes' : 'No'}</Text>
                    </View>
                </View>
            )}

            {appConfig.game === 'aoe2' && (
                <View className="flex-col gap-1">
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[50%] ml-5">{getTranslation('match.gameMode')}:</Text>
                        <Text className="flex-1 -ml-5">{match.gameModeName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[50%] ml-5">{getTranslation('match.map')}:</Text>
                        <Text className="flex-1 -ml-5">{match.mapName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[50%] ml-5">{getTranslation('match.mapsize')}:</Text>
                        <Text className="flex-1 -ml-5">{match.mapSizeName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Image source={require('../../../assets/explorer/match-icons/difficulty.png')} className="w-4 h-4"/>
                        <Text className="w-[50%]">{getTranslation('match.aidifficulty')}:</Text>
                        <Text className="flex-1 -ml-5">{match.difficultyName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Image source={require('../../../assets/explorer/match-icons/resources.png')} className="w-4 h-4"/>
                        <Text className="w-[50%]">{getTranslation('match.resources')}:</Text>
                        <Text className="flex-1 -ml-5">{match.resourcesName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Image source={require('../../../assets/explorer/match-icons/population.png')} className="w-4 h-4"/>
                        <Text className="w-[50%]">{getTranslation('match.population')}:</Text>
                        <Text className="flex-1 -ml-5">{match.population}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Image source={require('../../../assets/explorer/match-icons/speed.png')} className="w-4 h-4"/>
                        <Text className="w-[50%]">{getTranslation('match.gamespeed')}:</Text>
                        <Text className="flex-1 -ml-5">{match.speedName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Image source={require('../../../assets/explorer/match-icons/visibility.png')} className="w-4 h-4"/>
                        <Text className="w-[50%]">{getTranslation('match.revealmap')}:</Text>
                        <Text className="flex-1 -ml-5">{match.revealMapName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Image source={require('../../../assets/explorer/match-icons/age.png')} className="w-4 h-4"/>
                        <Text className="w-[50%]">{getTranslation('match.startingage')}:</Text>
                        <Text className="flex-1 -ml-5">{match.startingAgeName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Image source={require('../../../assets/explorer/match-icons/age.png')} className="w-4 h-4"/>
                        <Text className="w-[50%]">{getTranslation('match.endingage')}:</Text>
                        <Text className="flex-1 -ml-5">{match.endingAgeName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Image source={require('../../../assets/explorer/match-icons/treaty.png')} className="w-4 h-4"/>
                        <Text className="w-[50%]">{getTranslation('match.treatylength')}:</Text>
                        <Text className="flex-1 -ml-5">{match.treatyLength} minutes</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Image source={require('../../../assets/explorer/match-icons/victory.png')} className="w-4 h-4"/>
                        <Text className="w-[50%]">{getTranslation('match.victory')}:</Text>
                        <Text className="flex-1 -ml-5">{match.victoryName}</Text>
                    </View>

                    <View className="flex-row gap-1 mt-2">
                        <View className="flex-col gap-1 w-[50%]">
                            <Text className="mb-1">{getTranslation('match.teamSettings')}</Text>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.lockTeams ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.lockTeams')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.teamTogether ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.teamTogether')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.teamPositions ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.teamPositions')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.sharedExploration ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.sharedExploration')}</Text>
                            </View>
                        </View>
                        <View className="flex-col gap-1">
                            <Text className="mb-1">{getTranslation('match.advancedSettings')}</Text>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.lockSpeed ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.lockSpeed')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.allowCheats ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.allowCheats')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.turboMode ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.turboMode')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.fullTechTree ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.fullTechTree')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.empireWarsMode ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.empireWarsMode')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.suddenDeathMode ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.suddenDeathMode')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.regicideMode ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.regicideMode')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.antiquityMode ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.antiquityMode')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.recordGame ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.recordGame')}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </Card>
    );
}
