import { LoginPopupContext } from "@app/providers/login-popup-context";
import { useContext } from "react";

export const useLoginPopup = () => {
    const context = useContext(LoginPopupContext);
    if (!context) {
        throw new Error('useLoginPopup must be used within a LoginPopupProvider');
    }
    return context;
}