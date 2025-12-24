import { ComponentProps } from 'react';
import { useLoginPopup } from '@app/hooks/use-login-popup';
import { GestureResponderEvent } from 'react-native';

export const UserLoginWrapper = <T extends React.FC<{ onPress?: () => void }>>({
    Component,
    onPress,
    ...rest
}: { Component: T } & ComponentProps<T>) => {
    const props = rest as any;
    const { showLoginPopup, shouldPromptLogin } = useLoginPopup();

    return (
        <>
            <Component
                {...props}
                onPress={
                    shouldPromptLogin
                        ? (e: GestureResponderEvent) => {
                              e.preventDefault();
                              e.stopPropagation();
                              showLoginPopup();
                          }
                        : onPress
                }
                href={shouldPromptLogin ? null : props.href}
            />
        </>
    );
};
