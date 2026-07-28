// RenderInPortal.tsx
import { useEffect, useRef } from 'react';
import { usePortalManager } from '@app/components/portal/portal-host';

export const RenderInPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { mount, update, unmount } = usePortalManager();
    const keyRef = useRef<number | null>(null);

    // Teardown only. Kept separate from the mount/update effect below so that a
    // change to `children` updates the portal in place instead of unmounting and
    // remounting it.
    useEffect(() => {
        return () => {
            if (keyRef.current !== null) {
                unmount(keyRef.current);
            }
        };
    }, [unmount]);

    useEffect(() => {
        if (keyRef.current === null) {
            keyRef.current = mount(children);
        } else {
            update(keyRef.current, children);
        }
    }, [children, mount, update]);

    return null; // Nothing in place
};
