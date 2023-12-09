import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import { createStylesheet } from "../../theming-new";
import { MyText } from "./my-text";

export interface TagProps {
  children?: string | string[];
  icon?: ImageSourcePropType;
}

export const Tag: React.FC<TagProps> = ({ children, icon }) => {
  const styles = useStyles();

  return (
    <View style={styles.tag}>
      {icon && <Image style={styles.tagImage} source={icon} />}
      {children && <MyText style={styles.tagText}>{children}</MyText>}
    </View>
  );
};

const useStyles = createStylesheet((theme, darkMode) =>
  StyleSheet.create({
    tag: {
      backgroundColor: theme.skeletonColor,
      flexDirection: "row",
      alignItems: "center",
      padding: 4,
      borderRadius: 4,
      gap: 4,
    },
    tagText: {
      color: theme.textNoteColor,
      fontSize: 12,
    },
    tagImage: {
      width: 18,
      height: 18,
    },
  })
);
