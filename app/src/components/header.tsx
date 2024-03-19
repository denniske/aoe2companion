import NativeHeader from '@app/view/components/header';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { TouchableOpacity, View } from 'react-native';

import { HeaderTitle } from './header-title';
import { Icon } from './icon';
import { Text } from './text';

export const Header: React.FC<NativeStackHeaderProps | (BottomTabHeaderProps & { back?: boolean })> = ({ options, route, navigation, back }) => {
    const title = options.title || '';

    return (
        <View className="p-4 border-b border-b-gray-200 dark:border-b-gray-800 flex-row justify-between items-center relative h-20 bg-gold-50 dark:bg-blue-950">
            {back && (
                <View className="flex-1">
                    <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
                        <Icon icon="angle-left" size={22} />
                    </TouchableOpacity>
                </View>
            )}
            {back ? (
                typeof options.headerTitle === 'function' ? (
                    options.headerTitle({ children: title, tintColor: 'white' })
                ) : (
                    <HeaderTitle title={title} />
                )
            ) : (
                <Text variant="title" color="brand" className="flex-1" numberOfLines={1}>
                    {title}
                </Text>
            )}
            <View className={`flex-row items-center gap-2 ${back ? 'flex-1 justify-end' : ''}`}>{options.headerRight?.({ canGoBack: !!back })}</View>
            {/*<View className="absolute top-0 right-1 w-full flex-row justify-end">*/}
            {/*    <NativeHeader />*/}
            {/*</View>*/}
        </View>
    );
};
