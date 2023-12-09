import { createStylesheet } from "../../../theming-new";
import { Image, StyleSheet, View } from "react-native";
import { getOtherIcon } from "../../../helper/units";
import { MyText } from "../my-text";

interface IResourceAllocProps {
  resource: string;
  count: number;
}

export const ResourceAlloc: React.FC<IResourceAllocProps> = ({
  resource,
  count,
}) => {
  const styles = useStyles();

  return (
    <View style={styles.row}>
      <Image source={getOtherIcon(resource as any)} style={styles.picSmall} />
      <MyText style={styles.resourceCount}>{count}</MyText>
    </View>
  );
};

const useStyles = createStylesheet((theme, darkMode) =>
  StyleSheet.create({
    resourceCount: {
      fontSize: 18,
      fontWeight: "bold",
    },
    row: {
      marginRight: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    picSmall: {
      marginRight: 10,
      width: 24,
      height: 24,
    },
  })
);
