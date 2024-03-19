import { ImageBackground as ExpoImageBackground } from 'expo-image';
import { styled } from 'nativewind';

export const ImageBackground = styled(ExpoImageBackground, {
    classProps: ['imageStyle'],
});
