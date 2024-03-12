import { Redirect, useLocalSearchParams } from 'expo-router';

export default function Page() {
    const { id } = useLocalSearchParams<{ id: string }>();

    if (id) {
        return <Redirect href={`/explore/build-orders/${id}`} />;
    }

    return <Redirect href="/explore/build-orders" />;
}
