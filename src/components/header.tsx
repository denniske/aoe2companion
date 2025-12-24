import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Platform, TouchableOpacity, View } from 'react-native';

import { HeaderTitle } from './header-title';
import { Icon } from './icon';
import { Text } from './text';
import cn from 'classnames';
import { containerClassName } from '@app/styles';
import { useShowTabBar } from '@app/hooks/use-show-tab-bar';
import { Breadcrumbs } from './breadcrumbs';
import { SkeletonText } from './skeleton';

export const Header: React.FC<NativeStackHeaderProps | (BottomTabHeaderProps & { back?: boolean })> = ({ options, route, navigation, back }) => {
    const title = options.title || '';
    const headerRight = options.headerRight?.({ canGoBack: !!back });
    const showTabBar = useShowTabBar();
    const TextComponent = title ? Text : SkeletonText;

    return (
        <>
            {!showTabBar && (
                <View className="bg-gold-50 dark:bg-blue-950 z-10">
                    <Breadcrumbs title={title} />
                </View>
            )}
            <View
                className={cn(
                    'py-2 border-b border-b-gray-200 dark:border-b-gray-800 flex-row justify-between items-center relative h-20 md:h-18 bg-gold-50 dark:bg-blue-950',
                    back && Platform.OS !== 'web' && 'gap-3',
                    containerClassName
                )}
            >
                {back && Platform.OS !== 'web' && (
                    <View>
                        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
                            <Icon icon="angle-left" size={22} color="foreground" />
                        </TouchableOpacity>
                    </View>
                )}
                {(back && Platform.OS !== 'web') || typeof options.headerTitle === 'function' ? (
                    typeof options.headerTitle === 'function' ? (
                        options.headerTitle({ children: title, tintColor: 'white' })
                    ) : (
                        <HeaderTitle title={title} align={headerRight ? 'left' : 'center'} />
                    )
                ) : (
                    <TextComponent
                        variant="title"
                        color="brand"
                        className={cn('flex-1', !title && 'w-xs')}
                        numberOfLines={1}
                        allowFontScaling={false}
                        alt
                    >
                        {title}
                    </TextComponent>
                )}
                {back || headerRight ? <View className="flex-row items-center gap-2 min-w-[22px]">{headerRight}</View> : null}
            </View>
        </>
    );
};
