import { Link as ExpoLink, type LinkProps as ExpoLinkProps } from 'expo-router';
import { Text, TextProps } from './text';
import { FC } from 'react';
import cn from 'classnames';

export type LinkProps = Partial<Pick<ExpoLinkProps, 'href' | 'target'>> & TextProps;

export const Link: FC<LinkProps> = ({ href, target, children, className, ...props }) => {
    const element = href ? (
        <ExpoLink href={href} target={target}>
            {children}
        </ExpoLink>
    ) : (
        children
    );

    return (
        <Text className={cn("underline hover:text-blue-950 dark:hover:text-gold-300 transition-colors", className)} color="brand" variant="label" {...props}>
            {element}
        </Text>
    );
};
