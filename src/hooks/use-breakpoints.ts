import { useWindowDimensions } from 'react-native';

// MD breakpoint is the device size at which the site switches to tab bar.
const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
};

export const useBreakpoints = () => {
    const { width } = useWindowDimensions();

    return {
        isSmall: width >= breakpoints['sm'],
        isMedium: width >= breakpoints['md'],
        isLarge: width >= breakpoints['lg'],
        isExtraLarge: width >= breakpoints['xl'],
    };
};
