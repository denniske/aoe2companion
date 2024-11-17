import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAvoidingView as KeyboardAvoidingViewRN, Platform, KeyboardAvoidingViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const KeyboardAvoidingView: React.FC<KeyboardAvoidingViewProps> = (props) => {
    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();

    return (
        <KeyboardAvoidingViewRN
            behavior={Platform.select({ ios: 'padding', default: 'height' })}
            className="flex-1"
            keyboardVerticalOffset={headerHeight + insets.top - (insets.bottom + 82)}
            {...props}
        />
    );
};
