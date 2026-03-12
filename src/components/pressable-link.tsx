import { Link as ExpoLink, type LinkProps as ExpoLinkProps, useRouter } from 'expo-router';
import { Text, TextProps } from './text';
import { FC } from 'react';
import cn from 'classnames';
import { Pressable, View, ViewProps } from 'react-native';

export type LinkProps = Partial<Pick<ExpoLinkProps, 'href' | 'target'>> & ViewProps & { alt?: boolean };

export const PressableLink: FC<LinkProps> = ({ href, target, children, className, alt, ...props }) => {
    const router = useRouter();

    if (!href) {
        return <View {...props} className={className}>{children}</View>
    }

    return (
        <Pressable
            onPress={() => router.navigate(href)}
            // className={cn('p-4 hover:bg-gray-50 hover:dark:bg-blue-800 transition-colors', className)}
            {...props}
        >
            {children}
        </Pressable>
    );
};
