// RenderInPortal.tsx
import { useEffect, useRef } from 'react';
import { usePortalManager } from '@app/components/portal/portal-host';

export const RenderInPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { mount, update, unmount } = usePortalManager();
    const keyRef = useRef<number | null>(null);

    useEffect(() => {
        keyRef.current = mount(children);

        return () => {
            if (keyRef.current !== null) {
                unmount(keyRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (keyRef.current !== null) {
            update(keyRef.current, children);
        }
    }, [children]);

    return null; // Nothing in place
};
