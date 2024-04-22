import { router } from 'expo-router';
import { View, Pressable, ViewProps, PressableProps } from 'react-native';

export interface CardProps extends ViewProps {
    onPress?: PressableProps['onPress'];
    header?: React.ReactNode;
    footer?: React.ReactNode;
    direction?: 'horizontal' | 'vertical';
    href?: string;
    disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({ onPress, header, children, footer, direction = 'horizontal', href, ...props }) => {
    const Component = onPress || href ? Pressable : View;
    const directionStyles = direction === 'horizontal' ? 'flex-row p-2 items-center' : 'flex-col py-3 px-2';

    return (
        <Component
            onPress={(e) => {
                if (href) {
                    router.push(href);
                }
                onPress?.(e);
            }}
            {...props}
            className={`bg-white dark:bg-blue-900 rounded-lg border border-gray-200 dark:border-gray-800 gap-2 ${directionStyles}`}
        >
            {header}
            {children}
            {footer}
        </Component>
    );
};
