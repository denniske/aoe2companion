import { Platform, useWindowDimensions } from 'react-native';

// MD breakpoint is the device size at which the site switches to tab bar.
const MD_BREAKPOINT = 768;

export const useShowTabBar = () => {
    const { width } = useWindowDimensions();

    const hideTabBar = Platform.OS === 'web' && width >= MD_BREAKPOINT;

    return !hideTabBar;
};
