import { TextColor, textColors } from '@app/utils/text.util';
import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, Props } from '@fortawesome/react-native-fontawesome';
import { useResolveClassNames } from 'uniwind';

export { IconName, IconPrefix };

export interface IconProps {
    icon: IconName;
    size?: Props['size'];
    style?: Props['style'];
    color?: TextColor;
    prefix?: IconPrefix;
}

export const Icon: React.FC<IconProps> = ({ icon, color = 'default', prefix = 'fass', ...rest }) => {
    let colorClassName = textColors[color] ? textColors[color] : color;
    const finalColor = useResolveClassNames(colorClassName).color as string;
    // console.log('RESOLVE ICON', icon);


    // TODO: wrap FontAwesomeIcon with uniwind to resolve color properly

    return <FontAwesomeIcon {...rest} color={finalColor} icon={[prefix, icon]}/>;
};
