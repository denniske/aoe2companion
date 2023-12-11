import { TouchableWithoutFeedback, Keyboard, TouchableWithoutFeedbackProps, StyleSheet } from 'react-native';

export const DismissKeyboard = ({ onPress, ...rest }: TouchableWithoutFeedbackProps) => (
    <TouchableWithoutFeedback
        style={styles.container}
        {...rest}
        onPress={(e) => {
            Keyboard.dismiss();
            onPress?.(e);
        }}
        accessible={false}
    />
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
