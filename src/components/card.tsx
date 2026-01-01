import { Href, Link } from 'expo-router';
import { Fragment } from 'react';
import { Pressable, PressableProps, View, ViewProps } from 'react-native';
import { CustomFragment } from './custom-fragment';

export interface CardProps extends ViewProps {
    onPress?: PressableProps['onPress'];
    header?: React.ReactNode;
    footer?: React.ReactNode;
    direction?: 'horizontal' | 'vertical';
    href?: Href;
    disabled?: boolean;
    flat?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, flat, onPress, header, children, footer, direction = 'horizontal', href, ...props }) => {
    const Component = onPress || href ? Pressable : View;
    const Wrapper = href ? Link : CustomFragment;
    let colorStyles = `bg-white dark:bg-blue-900 rounded-lg border border-gray-200 dark:border-gray-800`;
    let alignmentStyles = direction === 'horizontal' ? 'items-center' : '';
    let paddingStyles = 'px-4 py-4';
    const directionStyles = direction === 'horizontal' ? 'flex-row items-center' : 'flex-col';

    if (flat) {
        paddingStyles = 'px-2 py-2 md:px-4 md:py-4';
    }

    return (
        <Wrapper asChild href={href!}>
            <Component
                onPress={onPress}
                {...props}
                className={`gap-2 ${alignmentStyles} ${colorStyles} ${paddingStyles} ${directionStyles} ${
                    onPress || href ? 'hover:bg-gray-50 hover:dark:bg-blue-800 transition-colors' : ''
                } ${className ?? ''} shadow-sm`}
            >
                {header}
                {children}
                {footer}
            </Component>
        </Wrapper>
    );
};
