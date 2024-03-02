import { router } from 'expo-router';

import { Text, TextProps } from './text';

export interface LinkProps extends TextProps {
    href?: string;
}

export const Link: React.FC<LinkProps> = ({ href, ...props }) => {
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
