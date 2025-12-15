import { accentColors, TextColor } from '@app/utils/text.util';
import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, Props } from '@fortawesome/react-native-fontawesome';
import { withUniwind } from 'uniwind';

export { IconName, IconPrefix };

export interface IconProps {
    icon: IconName;
    size?: Props['size'];
    style?: Props['style'];
    color?: TextColor;
    prefix?: IconPrefix;
    fill?: string;
}

export const StyledFontAwesomeIcon = withUniwind(FontAwesomeIcon);

export const Icon: React.FC<IconProps> = ({ icon, color = 'default', prefix = 'fass', fill, ...rest }) => {
    let colorClassName = accentColors[color] ?? color;

    return <StyledFontAwesomeIcon {...rest} className="focus:outline-none" colorClassName={colorClassName} color={fill} icon={[prefix, icon]} />;
};
