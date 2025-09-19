import { Card, CardProps } from '@app/components/card';
import { Icon, IconProps } from '@app/components/icon';
import { Text } from '@app/components/text';
import { timeStatus } from '@app/helper/tournaments';
import { format, isSameDay } from 'date-fns';
import { PlayoffMatch } from 'liquipedia';
import { orderBy } from 'lodash';
import { View } from 'react-native';

export interface StageCardProps extends CardProps {
    matches: PlayoffMatch[];
    title: string;
}

const statusMap: Record<ReturnType<typeof timeStatus>, { text: string; icon: IconProps['icon'] }> = {
    ongoing: {
        text: 'Ongoing',
        icon: 'wave-pulse',
    },
    upcoming: {
        text: 'Upcoming',
        icon: 'clock',
    },
    past: {
        text: 'Completed',
        icon: 'circle-check',
    },
};

export const StageCard: React.FC<StageCardProps> = ({ title, matches, ...props }) => {
    const start = orderBy(matches, 'startDate')[0]?.startTime;
    let end = orderBy(matches, 'startDate')[matches.length - 1]?.startTime;
    if (isSameDay(start ?? new Date(), end ?? new Date())) {
        end = undefined;
    }
    const status = timeStatus(start, end);
    const { text, icon } = statusMap[status];

    return (
        <Card {...props} className="gap-4 p-4">
            <Icon icon={icon} color="brand" size={24} />
            <View className="flex-1">
                <Text variant="header-sm">{title}</Text>
                <View className="flex-row items-center gap-2">
                    <Text variant="label" color="subtle">
                        {text}
                    </Text>
                    {start || end ? <Icon icon="minus" size={12} color="subtle" /> : null}
                    <Text color="subtle">
                        {start && format(start, 'LLL d')}
                        {start && end && ' - '}
                        {end && format(end, 'LLL d')}
                    </Text>
                </View>
            </View>
        </Card>
    );
};
