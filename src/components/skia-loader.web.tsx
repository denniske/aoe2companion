'use client';

import { Text } from 'react-native';
import React, { ComponentType, useEffect, useState } from 'react';
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { version } from 'canvaskit-wasm/package.json';

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
