import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { Text } from './text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NativeHeader from '@app/view/components/header';

export const Header: React.FC<NativeStackHeaderProps | BottomTabHeaderProps> = ({ options, route }) => {
    const { top } = useSafeAreaInsets();

    return (
        <View className="p-4 border-b border-b-gray-200 flex-row justify-between items-center" style={{ marginTop: top }}>
            <Text variant="title" color="brand">
                {options.title || route.name}
            </Text>

            <View>
                <NativeHeader />
            </View>
        </View>
    );
};
