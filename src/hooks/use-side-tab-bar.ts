import { Platform } from 'react-native';
import { useBreakpoints } from './use-breakpoints';

// On wide native windows (open iPhone Duo, iPad, phones in landscape) the tab bar becomes a
// vertical rail beside the content instead of floating over its bottom edge. Based on window
// size rather than device so it follows folding, split view and rotation.
export const useSideTabBar = () => {
    const { isSmall } = useBreakpoints();
    return Platform.OS !== 'web' && isSmall;
};

// Space the floating bottom bar covers, which scroll content has to clear. The rail covers none.
export const useTabBarBottomOffset = () => {
    const sideTabBar = useSideTabBar();
    return sideTabBar ? 0 : 82;
};
