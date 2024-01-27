import { View, Pressable, ViewProps, PressableProps } from 'react-native';

export interface CardProps extends ViewProps {
    onPress?: PressableProps['onPress'];
    header?: React.ReactNode;
    footer?: React.ReactNode;
    direction?: 'horizontal' | 'vertical';
}

export const Card: React.FC<CardProps> = ({ onPress, header, children, footer, direction = 'horizontal', ...props }) => {
    const Component = onPress ? Pressable : View;
    const directionStyles = direction === 'horizontal' ? 'flex-row p-2 items-center' : 'flex-col py-3 px-2';

    return (
        <Component
            onPress={onPress}
            {...props}
            className={`bg-white dark:bg-blue-900 rounded-lg border border-gray-200 dark:border-gray-800 g-2 ${directionStyles}`}
        >
            {header}
            {children}
            {footer}
        </Component>
    );
};
