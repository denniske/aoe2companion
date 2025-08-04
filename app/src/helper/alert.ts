import { Alert, Platform } from 'react-native'
import { AlertButton, AlertOptions } from 'react-native/Libraries/Alert/Alert';

const alertPolyfill = (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: AlertOptions
    ) => {
    const result = window.confirm([title, message].filter(Boolean).join('\n'))

    if (result) {
        const confirmOption = buttons?.find(({ style }) => style !== 'cancel')
        confirmOption && confirmOption?.onPress?.()
    } else {
        const cancelOption = buttons?.find(({ style }) => style === 'cancel')
        cancelOption && cancelOption?.onPress?.()
    }
}

export function showAlert(
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: AlertOptions
) {
    return Platform.OS === 'web' ? alertPolyfill(title, message, buttons, options) : Alert.alert(title, message, buttons, options)
}
