import { accentColors, TextColor } from '@app/utils/text.util';
import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, Props } from '@fortawesome/react-native-fontawesome';
import cn from 'classnames';
import { withUniwind } from 'uniwind';

export { IconName, IconPrefix };

export interface IconProps {
    icon: IconName;
    size?: Props['size'];
    style?: Props['style'];
    color?: TextColor;
    prefix?: IconPrefix;
    fill?: string;
    className?: string;
}

export const StyledFontAwesomeIcon = withUniwind(FontAwesomeIcon);

export const Icon: React.FC<IconProps> = ({ icon, color = 'default', prefix = 'fass', fill, className, ...rest }) => {
    let colorClassName = accentColors[color] ?? color;

    return (
        <StyledFontAwesomeIcon
            {...rest}
            className={cn('focus:outline-none', className)}
            colorClassName={colorClassName}
            color={fill}
            icon={[prefix, icon]}
        />
    );
};
