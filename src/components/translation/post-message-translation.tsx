import { useEffect } from 'react';
import { setTranslations } from '@app/helper/translate';
import { View } from 'react-native';

export function PostMessageTranslationsController() {
    useEffect(() => {
        if (window.self !== window.parent) {
            console.log('🧭 Inside iframe – requesting translations');
            window.parent.postMessage({ type: 'request-translations' }, '*');
        }

        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'translations') {
                console.log('✅ Translations received:', event.data.data);
                setTranslations('de', event.data.data);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return <View />;
}