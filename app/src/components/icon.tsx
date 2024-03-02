import { TextColor, textColors } from '@app/utils/text.util';
import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, Props } from '@fortawesome/react-native-fontawesome';
import { StyledComponent } from 'nativewind';

export { IconName, IconPrefix };

export interface IconProps {
    icon: IconName;
    size?: Props['size'];
    style?: Props['style'];
    color?: TextColor;
    prefix?: IconPrefix;
}

export const Icon: React.FC<IconProps> = ({ icon, style, color = 'default', prefix = 'fass', ...rest }) => {
    const textColor = textColors[color] ?? color;

    return <StyledComponent component={FontAwesomeIcon} {...rest} className={`${textColor}`} style={style} icon={[prefix, icon]} />;
};
