import { accentColors, TextColor } from '@app/utils/text.util';
import { IconDefinition, IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, Props } from '@fortawesome/react-native-fontawesome';
import cn from 'classnames';
import { withUniwind } from 'uniwind';

export { IconName, IconPrefix };

export interface IconProps {
    icon: IconName | IconDefinition;
    size?: Props['size'];
    style?: Props['style'];
    color?: TextColor;
    prefix?: IconPrefix;
    fill?: string | null;
    className?: string;
}

export const StyledFontAwesomeIcon = withUniwind(FontAwesomeIcon);

export const Icon: React.FC<IconProps> = ({ icon, color = 'default', prefix = 'fass', className, ...rest }) => {
    let colorClassName = accentColors[color] ?? color;

    return (
        <StyledFontAwesomeIcon
            {...rest}
            className={cn('focus:outline-none', className)}
            colorClassName={colorClassName}
            icon={typeof icon === 'string' ? [prefix, icon] : icon}
        />
    );
};
