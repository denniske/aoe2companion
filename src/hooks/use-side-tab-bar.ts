import { Platform } from 'react-native';
import { useBreakpoints } from './use-breakpoints';

// On wide phone windows (open iPhone Duo, Android tablets and foldables, landscape) the tab bar
// becomes a vertical rail beside the content instead of floating over its bottom edge, matching
// where iOS puts system bars on iPhone Duo and Material's navigation rail. Based on window size
// rather than device so it follows folding, split view and rotation. iPad keeps the bottom bar:
// its idiom is a top tab bar or sidebar, not a rail.
export const useSideTabBar = () => {
    const { isSmall } = useBreakpoints();
    const isPad = Platform.OS === 'ios' && Platform.isPad;
    return Platform.OS !== 'web' && !isPad && isSmall;
};

// Space the floating bottom bar covers, which scroll content has to clear. The rail covers none.
export const useTabBarBottomOffset = () => {
    const sideTabBar = useSideTabBar();
    return sideTabBar ? 0 : 82;
};
