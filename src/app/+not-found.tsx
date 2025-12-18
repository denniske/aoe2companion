import { Button } from "@app/components/button";
import { Text } from "@app/components/text";
import { router, Stack } from "expo-router";
import { View } from "react-native";
import cn from 'classnames';
import { containerClassName } from "@app/styles";

export default function NotFound() {
    return <View className={cn("flex-1 justify-center items-center gap-4 py-4", containerClassName)}>
        <Stack.Screen options={{headerShown: false}} />

        <Text variant="title" color="brand">Not Found</Text>

        <Text variant="label-lg" color="subtle">We can't seem to find the page you're looking for.</Text>

        {router.canGoBack() ? <Button onPress={() => router.back()}>Go Back</Button> : null}
    </View>
}