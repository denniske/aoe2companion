import { Image as BaseImage, ImageBackground, ImageProps } from 'expo-image';
import { withUniwind } from 'uniwind';

export const Image = withUniwind(BaseImage);

export { ImageBackground, ImageProps };
// expo-image's source type. RN 0.88's ImageSourcePropType includes readonly arrays, which expo-image does not accept.
export type ImageSourceProp = ImageProps['source'];
