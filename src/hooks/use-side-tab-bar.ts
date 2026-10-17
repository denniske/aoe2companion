import { Dimensions, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from '@/src/components/uniwind/safe-area-context';
import { useBreakpoints } from './use-breakpoints';

export type TabBarPlacement =
    | { position: 'bottom' }
    // compact: icon-only, filling the strip the system reserves (iPhone Duo).
    | { position: 'side'; side: 'left' | 'right'; compact: boolean };

// Where the tab bar goes.
//
// iPhone Duo: when the system lays bars out vertically (outer display, inner display in landscape),
// it moves the status bar into a strip along one edge and reports that strip as a horizontal
// safe-area inset on that side only -- the right edge, or the outer edge of each app in Split
// View. Apple's guidance is to put the tab bar at the bottom of that strip, as symbols only. A
// landscape notch insets both sides equally, so a one-sided inset is what identifies the strip.
//
// Android: Material's navigation rail on the leading edge once the window is wide (tablets,
// foldables, landscape).
//
// iPad keeps the bottom bar: its idiom is a top tab bar or sidebar, not a rail.
export const useTabBarPlacement = (): TabBarPlacement => {
    const { isSmall } = useBreakpoints();
    const { left, right } = useSafeAreaInsets();
    const window = useWindowDimensions();

    if (Platform.OS === 'ios' && !Platform.isPad) {
        if (right > 0 && left === 0) return { position: 'side', side: 'right', compact: true };
        if (left > 0 && right === 0) return { position: 'side', side: 'left', compact: true };
        // The left app in iPhone Duo Split View gets no inset at all (only the right app gets the
        // status strip), but Apple still puts its controls on its outer, left edge. An iPhone
        // window narrower than the screen can only be Split View, and without an inset it is the
        // left one.
        if (left === 0 && right === 0 && window.width < Dimensions.get('screen').width) {
            return { position: 'side', side: 'left', compact: true };
        }
    }
    if (Platform.OS === 'android' && isSmall) {
        return { position: 'side', side: 'left', compact: false };
    }
    return { position: 'bottom' };
};

export const useSideTabBar = () => useTabBarPlacement().position === 'side';

// Space the floating bottom bar covers, which scroll content has to clear. The rail covers none.
export const useTabBarBottomOffset = () => {
    const sideTabBar = useSideTabBar();
    return sideTabBar ? 0 : 82;
};
