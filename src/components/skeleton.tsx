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
    alt,
    // Callers swap Text for SkeletonText and keep the same props, children included. Those must not
    // reach the bars: children used to render inside them, and className/style were applied to both
    // the wrapper and every bar.
    children,
    style,
    ...props
}) => {
    const { fontSize, lineHeight } = textVariantStyles[variant ?? 'body'];

    return (
        <View className={cn('w-full justify-around', className)} style={[style, { height: lineHeight * numberOfLines }]} {...props}>
            {Array(numberOfLines)
                .fill(null)
                .map((_, index) => (
                    <Skeleton className="w-full" alt={alt} key={index} style={{ height: fontSize }} />
                ))}
        </View>
    );
};
