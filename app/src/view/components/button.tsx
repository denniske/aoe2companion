import { createStylesheet } from "../../theming-new";
import { GestureResponderEvent, Pressable, StyleSheet } from "react-native";
import { MyText } from "./my-text";

export interface ButtonProps {
  disabled?: boolean;
  children: string;
  onPress?: (event: GestureResponderEvent) => void;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  disabled,
  children,
  onPress,
  fullWidth,
}) => {
  const styles = useStyles();

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        fullWidth && styles.buttonFull,
      ]}
      onPress={onPress}
    >
      <MyText style={styles.buttonText}>{children}</MyText>
    </Pressable>
  );
};

const useStyles = createStylesheet((theme, darkMode) =>
  StyleSheet.create({
    button: {
      backgroundColor: "black",
      padding: 12,
      alignItems: "center",
      borderRadius: 4,
    },
    buttonPressed: {
      opacity: 0.6,
    },
    buttonDisabled: {
      opacity: 0.2,
    },
    buttonFull: {
      flex: 1,
    },
    buttonText: {
      color: "white",
      textTransform: "uppercase",
      fontWeight: "bold",
    },
  })
);
