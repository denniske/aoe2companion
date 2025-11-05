import { Image as BaseImage, ImageBackground, ImageProps } from 'expo-image';
import { withUniwind } from 'uniwind';

export const Image = withUniwind(BaseImage);

export { ImageBackground, ImageProps };