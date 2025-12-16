import { Button } from "@app/components/button";
import { Text } from "@app/components/text";
import { Link, router, Stack, Unmatched } from "expo-router";
import { View } from "react-native";

export default function NotFound() {
    return <View className="flex-1 justify-center items-center gap-4">
        <Stack.Screen options={{headerShown: false}} />

        <Text variant="title">Not Found</Text>

        <Text variant="label-lg">We can't seem to find the page you're looking for.</Text>

        {router.canGoBack() ? <Button onPress={() => router.back()}>Go Back</Button> : null}
    </View>
}