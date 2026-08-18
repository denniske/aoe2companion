'use client';

import { Text } from 'react-native';
import React, { ComponentType, useEffect, useState } from 'react';
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { version } from 'canvaskit-wasm/package.json';
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

    // Probably not needed because the map is only rendered after the user clicks the button, but just in case to avoid hydration error.
    // const [mounted, setMounted] = useState(false);
    //
    // useEffect(() => {
    //     setMounted(true);
    // }, []);
    //
    // if (!mounted) return <>{fallback}</>;

      return (
          <WithSkiaWeb
              opts={{ locateFile: (file) => `https://cdn.jsdelivr.net/npm/canvaskit-wasm@${version}/bin/full/${file}` }}
              getComponent={getComponent}
              fallback={fallback}
              componentProps={componentProps}
          />
      )
}
