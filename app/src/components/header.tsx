import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { TouchableOpacity, View } from 'react-native';

import { HeaderTitle } from './header-title';
import { Icon } from './icon';
import { Text } from './text';

export const Header: React.FC<NativeStackHeaderProps | (BottomTabHeaderProps & { back?: boolean })> = ({ options, route, navigation, back }) => {
    const title = options.title || '';
    const headerRight = options.headerRight?.({ canGoBack: !!back });

    return (
        <View
            className={`p-4 border-b border-b-gray-200 dark:border-b-gray-800 flex-row justify-between items-center relative h-20 bg-gold-50 dark:bg-blue-950 ${back ? 'gap-4' : ''}`}
        >
            {back && (
                <View>
                    <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
                        <Icon icon="angle-left" size={22} />
                    </TouchableOpacity>
                </View>
            )}
            {back ? (
                typeof options.headerTitle === 'function' ? (
                    options.headerTitle({ children: title, tintColor: 'white' })
                ) : (
                    <HeaderTitle title={title} align={headerRight ? 'left' : 'center'} />
                )
            ) : (
                <Text variant="title" color="brand" className="flex-1" numberOfLines={1} allowFontScaling={false}>
                    {title}
                </Text>
            )}
            {back ? <View className="flex-row items-center gap-2 min-w-[22px]">{headerRight}</View> : null}
        </View>
    );
};
