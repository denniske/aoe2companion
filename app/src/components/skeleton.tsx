import { TextVariant } from '@app/utils/text.util';
import { View, ViewProps } from 'react-native';

import { Text } from './text';

export const Skeleton: React.FC<ViewProps> = (props) => {
    return <View className="bg-gray-100 dark:bg-blue-950 rounded" {...props} />;
};

export const SkeletonText: React.FC<ViewProps & { variant?: TextVariant; numberOfLines?: number }> = ({ variant, numberOfLines = 1, ...props }) => {
    return (
        <Skeleton className="w-full" {...props}>
            <Text numberOfLines={numberOfLines} className="text-gray-100 dark:text-blue-950 " variant={variant}>
                {Array(numberOfLines).fill('Loading...').join('\n')}
            </Text>
        </Skeleton>
    );
};
