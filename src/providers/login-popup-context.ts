import { createContext } from 'react';

export const LoginPopupContext = createContext<{
    showLoginPopup: () => void;
    hideLoginPopup: () => void;
    canPromptLogin: boolean;
    shouldPromptLogin: boolean;
} | null>(null);
