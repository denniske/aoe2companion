import { breakpoints } from '@app/helper/breakpoints';
import { useWindowDimensions } from 'react-native';

export const useBreakpoints = () => {
    const { width } = useWindowDimensions();

    return {
        isSmall: width >= breakpoints['sm'],
        isMedium: width >= breakpoints['md'],
        isLarge: width >= breakpoints['lg'],
        isExtraLarge: width >= breakpoints['xl'],
    };
};
