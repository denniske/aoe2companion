import { OverlayToolbar } from '../_components/overlay-toolbar';
import { defaultOverlayToolbarProps, OverlayToolbarContext, OverlayToolbarProps } from './overlay-toolbar-context';
import { router, useLocalSearchParams } from 'expo-router';

export const OverlayToolbarProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const props = useLocalSearchParams<Partial<OverlayToolbarProps>>();

    const setProps = (newProps: Partial<OverlayToolbarProps>) => {
        router.setParams(newProps);
    };

    return (
        <OverlayToolbarContext.Provider value={{ ...defaultOverlayToolbarProps, ...props, setProps }}>
            {children}
            <OverlayToolbar />
        </OverlayToolbarContext.Provider>
    );
};
