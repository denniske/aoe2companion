import { Card } from '@app/components/card';
import { SkeletonText } from '@app/components/skeleton';
import { Text } from '@app/components/text';
import { format } from 'date-fns';
import { PlayoffMatch as IPlayoffMatch } from 'liquipedia';
import { useState } from 'react';
import { View, ViewStyle } from 'react-native';

import { PlayoffParticipant } from './playoffs/participant';
import { PlayoffPopup } from './playoffs/popup';

export type TournamentMatchProps = {
    games?: IPlayoffMatch['games'];
    links?: IPlayoffMatch['links'];
} & Omit<IPlayoffMatch, 'games' | 'links'>;

export const TournamentMatch: React.FC<{ match: TournamentMatchProps; style?: ViewStyle; onPress?: () => void }> = ({ match, style, onPress }) => {
    const [visible, setVisible] = useState(false);

    if (!match) {
        return <TournamentMatchSkeleton style={style} header />;
    }

    return (
        <Card direction="vertical" onPress={onPress ?? (() => setVisible(true))} disabled={match.participants.length < 2} style={style}>
            {match.header && (
                <View className="flex-row gap-2">
                    <Text variant="label-sm" className="flex-1" numberOfLines={1}>
                        {match.header.name}
                    </Text>
                    <Text variant="body-sm" color="subtle">
                        {match.header.format}
                    </Text>
                </View>
            )}
            {match.startTime && <Text color="brand">{format(match.startTime, 'PP - p')}</Text>}
            {match.participants.map((participant, index) => (
                <View className="flex-row" key={index}>
                    <PlayoffParticipant size={12} participant={participant} winner={match.winner === index} />

                    <Text variant={match.winner === index ? 'label' : 'body'}>{participant.score}</Text>
                </View>
            ))}

            {match.games && match.links && !onPress && <PlayoffPopup visible={visible} setVisible={setVisible} match={match as IPlayoffMatch} />}
        </Card>
    );
};

export const TournamentMatchSkeleton: React.FC<{ style?: ViewStyle; header?: boolean }> = ({ style, header }) => (
    <Card direction="vertical" disabled style={style}>
        {header && (
            <View className="flex-row justify-between">
                <SkeletonText variant="label-sm" />
                <SkeletonText variant="body-sm" />
            </View>
        )}

        <SkeletonText />
        <SkeletonText />
        <SkeletonText />
    </Card>
);
