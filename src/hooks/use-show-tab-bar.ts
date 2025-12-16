import { Platform } from 'react-native';
import { useBreakpoints } from './use-breakpoints';

export const useShowTabBar = () => {
    const { isMedium } = useBreakpoints();

    const hideTabBar = Platform.OS === 'web' && isMedium;

    return !hideTabBar;
};
