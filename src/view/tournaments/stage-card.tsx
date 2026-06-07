import { Card, CardProps } from '@app/components/card';
import { Icon } from '@app/components/icon';
import { faCircleCheck, faClock, faMinus, faWavePulse } from '@fortawesome/sharp-solid-svg-icons';
import { Text } from '@app/components/text';
import { timeStatus } from '@app/helper/tournaments';
import { format, isSameDay } from 'date-fns';
import { PlayoffMatch } from 'liquipedia';
import { orderBy } from 'lodash';
import { View } from 'react-native';
import { formatCustom } from '@nex/data';

export interface StageCardProps extends CardProps {
    matches: PlayoffMatch[];
    title: string;
}

const statusMap: Record<ReturnType<typeof timeStatus>, { text: string; icon: import('@fortawesome/fontawesome-svg-core').IconDefinition }> = {
    ongoing: {
        text: 'Ongoing',
        icon: faWavePulse,
    },
    upcoming: {
        text: 'Upcoming',
        icon: faClock,
    },
    past: {
        text: 'Completed',
        icon: faCircleCheck,
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
                    {start || end ? <Icon icon={faMinus} size={12} color="subtle" /> : null}
                    <Text color="subtle">
                        {start && formatCustom(start, 'LLL d')}
                        {start && end && ' - '}
                        {end && formatCustom(end, 'LLL d')}
                    </Text>
                </View>
            </View>
        </Card>
    );
};
