import { TouchableWithoutFeedback, Keyboard, TouchableWithoutFeedbackProps, StyleSheet, Platform } from 'react-native';

export const DismissKeyboard = ({ onPress, ...rest }: TouchableWithoutFeedbackProps) => (
    <TouchableWithoutFeedback
        style={styles.container}
        {...rest}
        onPress={(e) => {
            if (Platform.OS !== 'web') {
                Keyboard.dismiss();
            }
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
