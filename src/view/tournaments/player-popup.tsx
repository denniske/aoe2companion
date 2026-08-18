import { useTournamentPlayer } from '@app/api/tournaments';
import { Card } from '@app/components/card';
import { Text } from '@app/components/text';
import { format } from 'date-fns';
import { Image } from '@/src/components/uniwind/image';
import { ActivityIndicator, View } from 'react-native';
import { formatCurrency } from 'react-native-format-currency';

import { TournamentMarkdown } from './tournament-markdown';
import {BottomSheet, BottomSheetProps} from '../bottom-sheet';
import { formatCustom } from '@nex/data';
import { useTranslation } from '@app/helper/translate';

const Attribute: React.FC<{ label: string; value?: string }> = ({ label, value }) =>
    value && (
        <View className="flex-row justify-between items-center">
            <Text variant="header-xs">{label}</Text>
            <Text variant="body-sm">{value}</Text>
        </View>
    );

export const TournamentPlayerPopup: React.FC<{ id: string; title: string } & Pick<BottomSheetProps, 'isActive' | 'onClose'>> = ({ id, ...props }) => {
    const getTranslation = useTranslation();
    const { data: player, isLoading } = useTournamentPlayer(id);
    const total = player?.totalWinnings;

    return (
        <BottomSheet {...props} closeButton>
            {isLoading ? (
                <ActivityIndicator size="large" />
            ) : (
                player && (
                    <View className="mt-4 gap-4">
                        <Card direction="horizontal" className="px-3 gap-3">
                            {!!(player.image) && (
                                <Image source={{ uri: player.image }} className="w-28" style={{ aspectRatio: 0.66 }} contentFit="contain" />
                            )}
                            <View className="gap-0.5 flex-1">
                                <Attribute label={getTranslation('tournaments.player.name')} value={player.fullName} />
                                <Attribute
                                    label={getTranslation('tournaments.player.age')}
                                    value={`${player.age}${player.birthdate && !isNaN(player.birthdate?.valueOf()) ? ` (${formatCustom(player.birthdate, 'LLL d, y')})` : ''}`}
                                />
                                <Attribute
                                    label={getTranslation('tournaments.player.totalwinnings')}
                                    value={total && formatCurrency({ ...total, amount: Math.round(total.amount) })[0].replace(/(,\d{3})/i, 'K')}
                                />
                                <Attribute label={getTranslation('tournaments.player.status')} value={player.status} />
                                <Attribute label={getTranslation('tournaments.player.yearsactive')} value={player.yearsActive} />
                                <Attribute label={getTranslation('tournaments.player.team')} value={player.team} />
                            </View>
                        </Card>
                        <TournamentMarkdown>{player.bio ?? ''}</TournamentMarkdown>
                    </View>
                )
            )}
        </BottomSheet>
    );
};
