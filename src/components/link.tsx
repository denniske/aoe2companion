import { Href, router } from 'expo-router';
import { Text, TextProps } from './text';
import { FC } from 'react';

export interface LinkProps extends TextProps {
    href?: Href;
}

export const Link: FC<LinkProps> = ({ href, ...props }) => {
    return (
        <Text
            onPress={() => {
                if (href) {
                    router.navigate(href);
                }
            }}
            className="underline"
            color="brand"
            variant="label"
            {...props}
        />
    );
};
