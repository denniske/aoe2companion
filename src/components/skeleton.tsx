import { TextVariant, textVariantStyles } from '@app/utils/text.util';
import { View, ViewProps } from 'react-native';

import cn from 'classnames';

export const Skeleton: React.FC<ViewProps & { alt?: boolean }> = ({ className, alt, children, ...props }) => {
    const color = alt ? 'bg-gray-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-blue-950';

    return <View className={cn('rounded animate-pulse', color, className)} {...props} />;
};

export const SkeletonText: React.FC<ViewProps & { variant?: TextVariant; numberOfLines?: number; alt?: boolean }> = ({
    variant,
    numberOfLines = 1,
    className,
    ...props
}) => {
    const { fontSize, lineHeight } = textVariantStyles[variant ?? 'body'];

    return (
        <View className={cn('w-full justify-around', className)} style={{ height: lineHeight * numberOfLines }} {...props}>
            {Array(numberOfLines)
                .fill(null)
                .map((_, index) => (
                    <Skeleton className={cn('w-full', className)} key={index} style={{ height: fontSize }} {...props}></Skeleton>
                ))}
        </View>
    );
};
