
import { TextColor, textColors } from '@app/utils/text.util';
import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, Props } from '@fortawesome/react-native-fontawesome';
import {useTw} from "@app/tailwind";

export { IconName, IconPrefix };

export interface IconProps {
    icon: IconName;
    size?: Props['size'];
    style?: Props['style'];
    color?: TextColor;
    prefix?: IconPrefix;
}

export const Icon: React.FC<IconProps> = ({ icon, color = 'default', prefix = 'fass', ...rest }) => {
    const tw = useTw();
    const textColor = textColors[color] ?? color;
    const iconStyle = tw.style(textColor);
    // const iconStyle = tw.style('bg-yellow-500 gap-2');
    // console.log('iconStyle', iconStyle);
    return <FontAwesomeIcon {...rest} color={iconStyle.color as string} icon={[prefix, icon]}/>;
};
