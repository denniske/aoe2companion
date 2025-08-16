import { Button } from '@app/components/button';
import { Header } from '@app/components/header';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useTranslation } from '@app/helper/translate';

export default function Unmatched() {
    const getTranslation = useTranslation();

    const params = useLocalSearchParams<{ unmatched?: string[] }>();

    const attemptedPath = Array.isArray(params.unmatched) ? '/' + params.unmatched.join('/') : '/';

    return (
        <View className="flex-1 items-center justify-center">
            <Stack.Screen options={{ title: getTranslation('notfound.title'), headerShown: true, header: (props) => <Header {...props} /> }} />

            <Button href="/">{getTranslation('notfound.home')}</Button>

            {/*<MyText>{attemptedPath}</MyText>*/}
        </View>
    );
}
