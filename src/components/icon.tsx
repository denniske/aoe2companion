
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
    let finalColor = 'black';
    if (textColors[color]) {
        const textColor = textColors[color] ?? color;
        const iconStyle = tw.style(textColor);
        finalColor = iconStyle.color as string;
    } else {
        const iconStyle = tw.style(color);
        finalColor = iconStyle.color as string;
    }
    // console.log('iconStyle', color, finalColor);
    return <FontAwesomeIcon {...rest} color={finalColor} icon={[prefix, icon]}/>;
};
