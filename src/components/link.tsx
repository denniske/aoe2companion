import { Link as ExpoLink, type LinkProps as ExpoLinkProps } from 'expo-router';
import { Text, TextProps } from './text';
import { FC } from 'react';
import cn from 'classnames';

export type LinkProps = Partial<Pick<ExpoLinkProps, 'href' | 'target'>> & TextProps & { alt?: boolean };

export const Link: FC<LinkProps> = ({ href, target, children, className, alt, ...props }) => {
    const element = href ? (
        <ExpoLink href={href} target={target}>
            {children}
        </ExpoLink>
    ) : (
        children
    );

    return (
        <Text
            className={cn(alt ? 'hover:underline' : 'underline hover:text-blue-950 dark:hover:text-gold-300 transition-colors', className)}
            color={alt ? 'link' : 'brand'}
            variant={alt ? 'body' : 'label'}
            {...props}
        >
            {element}
        </Text>
    );
};
