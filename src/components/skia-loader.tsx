import { Text } from 'react-native';
import { ComponentType, useEffect, useState } from 'react';
import { useTranslation } from '@app/helper/translate';

interface SkiaLoaderProps {
    getComponent: () => Promise<{ default: React.ComponentType<any> }>;
    componentProps?: any;
    fallback?: React.ReactNode;
}

function DefaultFallback() {
    const getTranslation = useTranslation();
    return <Text>{getTranslation('common.loading')}</Text>;
}

// Hoisted rather than written inline as a default value: React Compiler cannot
// reorder a JSX element used as a destructuring default, and bails out on the
// whole component.
const defaultFallback = <DefaultFallback />;

export default function SkiaLoader({
                                       getComponent,
                                       componentProps = {},
                                       fallback = defaultFallback,
                                   }: SkiaLoaderProps) {
    const [Component, setComponent] = useState<ComponentType<any> | null>(null);

    useEffect(() => {
        getComponent().then((mod) => setComponent(() => mod.default));
    }, [getComponent]);

    if (!Component) return <>{fallback}</>;

    return <Component {...componentProps} />;
}
