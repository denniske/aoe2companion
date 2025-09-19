import { View, ViewProps } from 'react-native';

import { Text } from './text';

export interface ProgressBarProps extends ViewProps {
    status?: 'default' | 'negative' | 'positive';
    label?: string;
    percent?: number;
    max?: number;
}

const statusColors: Record<NonNullable<ProgressBarProps['status']>, { color: string; borderColor: string; backgroundColor: string }> = {
    default: {
        color: 'text-black dark:text-white',
        borderColor: 'border-blue-100 dark:border-blue-700',
        backgroundColor: 'bg-blue-50 dark:bg-blue-800',
    },
    negative: {
        color: 'text-black dark:text-white',
        borderColor: 'border-red-300 dark:border-red-700',
        backgroundColor: 'bg-red-200 dark:bg-red-800',
    },
    positive: {
        color: 'text-black dark:text-white',
        borderColor: 'border-green-300 dark:border-green-700',
        backgroundColor: 'bg-green-200 dark:bg-green-800',
    },
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ status = 'default', label, percent = 0, max = 100, ...props }) => {
    const { color, borderColor, backgroundColor } = statusColors[status];
    return (
        <View>
            {label && (
                <Text variant="label-xs" className="uppercase">
                    {label}
                </Text>
            )}
            <View className={`h-5 border flex-row rounded relative ${borderColor}`} {...props}>
                <View className={`${backgroundColor}`} style={{ width: `${(percent / max) * 100}%` }} />
                <View className="absolute w-full h-full items-center justify-center">
                    <Text variant="label-sm" className={`${color}`}>
                        {percent.toFixed(2)}%
                    </Text>
                </View>
            </View>
        </View>
    );
};
