// PortalHost.tsx
import { createContext, use, useState } from 'react';
import { StyleSheet, View } from 'react-native';

type PortalItem = {
    key: number;
    node: React.ReactNode;
};

const PortalContext = createContext<{
    mount: (node: React.ReactNode) => number;
    update: (key: number, node: React.ReactNode) => void;
    unmount: (key: number) => void;
}>({
    mount: () => -1,
    update: () => {},
    unmount: () => {},
});

let nextKey = 0;

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [portals, setPortals] = useState<PortalItem[]>([]);

    const mount = (node: React.ReactNode) => {
        const key = nextKey++;
        setPortals((prev) => [...prev, { key, node }]);
        return key;
    };

    const update = (key: number, node: React.ReactNode) => {
        setPortals((prev) =>
            prev.map((item) => (item.key === key ? { ...item, node } : item))
        );
    };

    const unmount = (key: number) => {
        setPortals((prev) => prev.filter((item) => item.key !== key));
    };

    return (
        <PortalContext.Provider value={{ mount, update, unmount }}>

            <View style={{ flex: 1 }}>
                {children}
            </View>

            {/* Portal content */}
            {portals.map(({ key, node }) => (
                <View key={key} style={[StyleSheet.absoluteFillObject, { pointerEvents: 'box-none'}]}>
                    {node}
                </View>
            ))}

        </PortalContext.Provider>
    );
};

export const usePortalManager = () => use(PortalContext);
