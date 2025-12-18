import { LoginModal } from '@app/components/login-modal';
import { useEffect, useState } from 'react';
import { LoginPopupContext } from './login-popup-context';
import useAuth from '@/data/src/hooks/use-auth';
import { Platform } from 'react-native';

export const LoginPopupProvider = ({ children }: { children: React.ReactNode }) => {
    const user = useAuth();
    const canPromptLogin = Platform.OS === 'web';
    const shouldPromptLogin = !user && canPromptLogin;
    const [isLoginPopupVisible, setIsLoginPopupVisible] = useState(false);

    const showLoginPopup = () => {
        setIsLoginPopupVisible(true);
    };

    const hideLoginPopup = () => {
        setIsLoginPopupVisible(false);
    };

    return (
        <LoginPopupContext.Provider value={{ showLoginPopup, hideLoginPopup, canPromptLogin, shouldPromptLogin }}>
            {children}
            {canPromptLogin && <LoginModal isVisible={isLoginPopupVisible} onClose={hideLoginPopup} />}
        </LoginPopupContext.Provider>
    );
};
