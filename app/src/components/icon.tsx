import tw from '@app/tailwind';
import { TextColor, textColors } from '@app/utils/text.util';
import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, Props } from '@fortawesome/react-native-fontawesome';
import { useColorScheme } from 'nativewind';

export { IconName, IconPrefix };

export interface IconProps {
    icon: IconName;
    size?: Props['size'];
    style?: Props['style'];
    color?: TextColor;
    prefix?: IconPrefix;
}

export const Icon: React.FC<IconProps> = ({ icon, color = 'default', prefix = 'fass', ...rest }) => {
    useColorScheme();
    const textColor = textColors[color] ?? color;
    const iconStyle = tw.style(textColor);
    return <FontAwesomeIcon {...rest} color={iconStyle.color as string} icon={[prefix, icon]}/>;
};
