import { OverlayToolbar, OverlayToolbarOptions } from '../_components/overlay-toolbar';
import { defaultOverlayToolbarProps, OverlayToolbarContext, OverlayToolbarProps } from './overlay-toolbar-context';
import { router, useLocalSearchParams } from 'expo-router';

export const OverlayToolbarProvider: React.FC<React.PropsWithChildren<{ options: OverlayToolbarOptions }>> = ({ children, options }) => {
    const props = useLocalSearchParams<Partial<OverlayToolbarProps>>();

    const setProps = (newProps: Partial<OverlayToolbarProps>) => {
        router.setParams(newProps);
    };

    return (
        <OverlayToolbarContext.Provider value={{ ...defaultOverlayToolbarProps, ...props, setProps }}>
            {children}
            <OverlayToolbar options={options} />
        </OverlayToolbarContext.Provider>
    );
};
