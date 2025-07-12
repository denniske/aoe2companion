import { router } from 'expo-router';
import { View, Pressable, ViewProps, PressableProps } from 'react-native';

export interface CardProps extends ViewProps {
    onPress?: PressableProps['onPress'];
    header?: React.ReactNode;
    footer?: React.ReactNode;
    direction?: 'horizontal' | 'vertical';
    href?: string;
    disabled?: boolean;
    flat?: boolean;
}

export const Card: React.FC<CardProps> = ({ flat, onPress, header, children, footer, direction = 'horizontal', href, ...props }) => {
    const Component = onPress || href ? Pressable : View;
    let colorStyles = `bg-white dark:bg-blue-900 rounded-lg border border-gray-200 dark:border-gray-800`;
    let alignmentStyles = direction === 'horizontal' ? 'items-center' : '';
    let paddingStyles = 'p-4';
    const directionStyles = direction === 'horizontal' ? 'flex-row items-center' : 'flex-col';

    if (flat) {
        colorStyles = '';
        paddingStyles = '';
    }

    return (
        <Component
            onPress={(e) => {
                if (href) {
                    router.push(href);
                }
                onPress?.(e);
            }}
            {...props}
            className={`gap-2 ${alignmentStyles} ${colorStyles} ${paddingStyles} ${directionStyles}`}
        >
            {header}
            {children}
            {footer}
        </Component>
    );
};
