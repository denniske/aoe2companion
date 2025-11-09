import { View, ViewStyle } from 'react-native';
import { PlayoffRound as IPlayoffRound } from 'liquipedia';
import { PlayoffMatch } from './match';
import { Text } from '@app/components/text';
import { FC } from 'react';

interface Props {
    className?: string;
    style?: ViewStyle;
    round: IPlayoffRound;
}

export const PlayoffRound: FC<Props> = (props) => {
    const { className, style, round } = props;
    const containsAdditionalHeader = round.matches.some((match) => match.header);
    return (
        <View className={`${className} gap-2`} style={style}>
            <View className="flex-row items-center justify-between">
                <Text variant="label-lg">{round.name}</Text>
                <Text variant="label">{round.format}</Text>
            </View>

            <View className="flex-1 gap-2 relative">
                {round.matches.map((match, index) => {
                    return <PlayoffMatch key={index} match={match} />;
                })}
            </View>
        </View>
    );
};
