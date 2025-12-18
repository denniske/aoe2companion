import { Link as ExpoLink, type LinkProps as ExpoLinkProps } from 'expo-router';
import { Text, TextProps } from './text';
import { FC } from 'react';

export type LinkProps = Partial<Pick<ExpoLinkProps, 'href' | 'target'>> & TextProps;

export const Link: FC<LinkProps> = ({ href, target, children, ...props }) => {
    const element = href ? (
        <ExpoLink href={href} target={target}>
            {children}
        </ExpoLink>
    ) : (
        children
    );

    return (
        <Text className="underline" color="brand" variant="label" {...props}>
            {element}
        </Text>
    );
};
