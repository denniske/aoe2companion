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
}

export const StyledFontAwesomeIcon = withUniwind(FontAwesomeIcon);

export const Icon: React.FC<IconProps> = ({ icon, color = 'default', prefix = 'fass', ...rest }) => {
    let colorClassName = accentColors[color] ?? color;
    // console.log('ICON COLOR CLASS NAME', colorClassName);
    return <StyledFontAwesomeIcon {...rest} colorClassName={colorClassName} icon={[prefix, icon]}/>;
};
