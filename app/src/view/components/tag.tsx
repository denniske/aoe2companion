import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { createStylesheet } from '../../theming-new';
import { MyText } from './my-text';

export interface TagProps {
    children?: string | string[];
    icon?: ImageSourcePropType;
    leftComponent?: React.ReactNode;
    selected?: boolean;
    size?: 'large' | 'small';
}

export const Tag: React.FC<TagProps> = ({ leftComponent, children, icon, selected, size = 'small' }) => {
    const styles = useStyles();

    return (
        <View style={[styles.tag, selected && styles.selectedTag, styles[size]]}>
            {leftComponent}
            {icon && <Image style={styles.tagImage} source={icon} />}
            {children && <MyText style={[styles.tagText, size === 'large' && { fontWeight: '600', fontSize: 14 }]}>{children}</MyText>}
        </View>
    );
};

const useStyles = createStylesheet((theme, darkMode) =>
    StyleSheet.create({
        tag: {
            backgroundColor: theme.skeletonColor,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 4,
            borderRadius: 4,
            gap: 4,
        },
        small: {},
        large: {
            padding: 6,
        },
        selectedTag: {
            backgroundColor: theme.hoverBackgroundColor,
        },
        tagText: {
            color: theme.textNoteColor,
            fontSize: 12,
        },
        tagImage: {
            width: 18,
            height: 18,
        },
    } as const)
);
