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

// Incremented through a helper rather than `nextKey++` inline: React Compiler
// cannot lower an update expression whose target is a module-level binding, and
// bails out on the whole component. (Assigning to it directly is worse — that is
// a genuine "cannot reassign variables declared outside the component" rule
// violation.) Keys stay globally unique, as before.
function takeNextKey() {
    return nextKey++;
}

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [portals, setPortals] = useState<PortalItem[]>([]);

    const mount = (node: React.ReactNode) => {
        const key = takeNextKey();
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
                <View key={key} style={[StyleSheet.absoluteFill, { pointerEvents: 'box-none'}]}>
                    {node}
                </View>
            ))}

        </PortalContext.Provider>
    );
};

export const usePortalManager = () => use(PortalContext);
