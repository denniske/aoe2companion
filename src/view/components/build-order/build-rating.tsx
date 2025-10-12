import { Icon } from '@app/components/icon';
import { Text } from '@app/components/text';
import { View } from 'react-native';

import { IBuildOrder } from '@/data/src/helper/builds';

export const BuildRating: React.FC<IBuildOrder & { showCount?: boolean }> = ({ showCount = true, ...build }) => {
    const filledStars = Math.round(build.avgRating ?? 0);
    const unfilledStars = Math.round(5 - filledStars);

    return (
        <View className="flex-row items-center gap-1.5">
            <View className="flex-row gap-0.5">
                {Array(filledStars)
                    .fill(null)
                    .map((_, index) => (
                        <Icon icon="star" size={14} key={`filled-${index}`} color="brand" />
                    ))}
                {Array(unfilledStars)
                    .fill(null)
                    .map((_, index) => (
                        <Icon icon="star" size={14} key={`unfilled-${index}`} color="brand" prefix="fasr" />
                    ))}
            </View>
            {showCount && (
                <Text variant="header-xs" color="subtle">
                    {build.numberOfRatings}
                </Text>
            )}
        </View>
    );
};
