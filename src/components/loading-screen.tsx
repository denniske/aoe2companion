import { containerClassName } from '@app/styles';
import cn from 'classnames';
import { ActivityIndicator, View } from 'react-native';

export const LoadingScreen = () => (
    <View className={cn(containerClassName, 'flex-1 justify-center items-center')}>
        <ActivityIndicator animating size="large" color="#999" />
    </View>
);
