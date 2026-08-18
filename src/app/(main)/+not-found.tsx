import { Button } from '@app/components/button';
import { Text } from '@app/components/text';
import { router, Stack } from 'expo-router';
import { View } from 'react-native';
import cn from 'classnames';
import { containerClassName } from '@app/styles';
import { useTranslation } from '@app/helper/translate';

export default function NotFound() {
    const getTranslation = useTranslation();

    return (
        <View className={cn('flex-1 justify-center items-center gap-4 py-4', containerClassName)}>
            <Stack.Screen options={{ headerShown: false }} />

            <Text variant="title" color="brand">
                {getTranslation('notfound.title')}
            </Text>

            <Text variant="label-lg" color="subtle">
                {getTranslation('notfound.description')}
            </Text>

            {router.canGoBack() ? <Button onPress={() => router.back()}>{getTranslation('notfound.goback')}</Button> : null}
        </View>
    );
}
