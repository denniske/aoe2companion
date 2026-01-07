import { createContext, useContext } from 'react';

export type OverlayToolbarProps = {
    horizontal: 'left' | 'center' | 'right';
    vertical: 'top' | 'center' | 'bottom';
    padding: string;
    scale: string;
    count: string;
    hideToolbar?: string;
};

export const defaultOverlayToolbarProps: OverlayToolbarProps = { horizontal: 'left', vertical: 'top', padding: '0', scale: '1.5', count: '12' };

interface OverlayToolbarContextProps extends OverlayToolbarProps {
    setProps: (props: Partial<OverlayToolbarProps>) => void;
}

export const OverlayToolbarContext = createContext<OverlayToolbarContextProps>({ ...defaultOverlayToolbarProps, setProps: () => undefined });

export const useToolbarProps = () => useContext(OverlayToolbarContext);

export const useToolbarStyles = () => {
    const { horizontal, vertical, padding, scale, count } = useToolbarProps();

    const sanitizedPadding = padding && !isNaN(Number(padding)) ? Number(padding) : 0;
    const sanitizedScale = scale && !isNaN(Number(scale)) ? Number(scale) : 0;

    const horizontalMap: Record<string, string> = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end',
    };

    const verticalMap: Record<string, string> = {
        top: 'flex-start',
        center: 'center',
        bottom: 'flex-end',
    };

    return {
        container: {
            justifyContent: horizontalMap[horizontal],
            alignItems: verticalMap[vertical],
        },
        content: {
            scale: sanitizedScale,
            transformOrigin: `${horizontal} ${vertical}`,
            padding: sanitizedPadding,
        },
        count: Number(count),
    };
};
