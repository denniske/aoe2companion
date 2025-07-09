import { Text } from 'react-native';
import { ComponentType, useEffect, useState } from 'react';

interface SkiaLoaderProps {
    getComponent: () => Promise<{ default: React.ComponentType<any> }>;
    componentProps?: any;
    fallback?: React.ReactNode;
}

export default function SkiaLoader({
                                       getComponent,
                                       componentProps = {},
                                       fallback = <Text>Loading...</Text>,
                                   }: SkiaLoaderProps) {
    const [Component, setComponent] = useState<ComponentType<any> | null>(null);

    useEffect(() => {
        getComponent().then((mod) => setComponent(() => mod.default));
    }, []);

    if (!Component) return <>{fallback}</>;

    return <Component {...componentProps} />;
}
