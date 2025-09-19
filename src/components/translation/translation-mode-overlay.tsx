import { useMMKVString } from 'react-native-mmkv';
import { useEffect, useRef } from 'react';
import { Platform, View } from 'react-native';
import { setTranslations } from '@app/helper/translate';

export function TranslationModeOverlay() {
    const [mode, setMode] = useMMKVString('translationMode');
    const keyHeldRef = useRef(false);

    useEffect(() => {
        if (window.self === window.parent) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.repeat) return; // Ignore repeated key presses

            if (e.key === 'Control' || e.key === 'Meta') {
                keyHeldRef.current = true;
                setMode('key');
                console.log('Translation mode activated');
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Control' || e.key === 'Meta') {
                keyHeldRef.current = false;
                setMode(undefined);
            }
        };

        const handleClick = (e: MouseEvent) => {
            if (keyHeldRef.current) {
                e.stopPropagation();
                e.preventDefault();
                console.log('Clicked translation key:', e.target);
                const target = e.target as HTMLElement;
                const key = target?.textContent?.trim();
                if (key) {
                    console.log('Clicked translation key:', key);
                    window.parent.postMessage({ type: 'request-key', key }, '*');
                    keyHeldRef.current = false;
                    setMode(undefined);
                }
            }
        };

        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'forwarded-event') {
                console.log('✅ Forwarded event received:', event.data);

                if (event.data.eventType === 'keydown') {
                    handleKeyDown({
                        key: event.data.key || '',
                        ctrlKey: event.data.ctrlKey || false,
                        metaKey: event.data.metaKey || false,
                        repeat: false // Assuming no repeat for forwarded events
                    } as KeyboardEvent);
                }
                if (event.data.eventType === 'keyup') {
                    handleKeyUp({
                        key: event.data.key || '',
                        ctrlKey: event.data.ctrlKey || false,
                        metaKey: event.data.metaKey || false
                    } as KeyboardEvent);
                }
                // if (event.data.eventType === 'click') {
                //     // handleClick({
                //     //     target: document.querySelector(`[data-key="${event.data.key}"]`) || document.body,
                //     //     stopPropagation: () => {},
                //     //     preventDefault: () => {}
                //     // } as MouseEvent);
                // }
            }
        };

        window.addEventListener('message', handleMessage);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('click', handleClick, true);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('click', handleClick, true);
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    if (mode !== 'key') return null;

    return (
        <View
            className="pointer-events-none"
        ></View>
    );
}