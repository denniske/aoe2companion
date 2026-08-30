import * as Sentry from '@sentry/react-native';
import { appConfig } from '@nex/dataset';
import { AppState, Platform } from 'react-native';

// iOS seals the app container under NSFileProtectionCompleteUntilFirstUserAuthentication until the
// user unlocks the device once after a reboot. iOS still prewarms the app in the background during
// that window, so our boot-time AsyncStorage reads reject with EPERM. Nothing is lost -- AsyncStorage
// rejects rather than resolving null, so no caller mistakes the failure for "no data" and overwrites
// it with defaults -- and the next foreground launch reads fine. Nobody is watching a prewarmed app,
// so drop the noise instead of reporting it.
const PROTECTED_DATA_PREFIXES = ['Failed to read storage file', 'Failed to write storage file', 'Failed to create storage directory'];

function isProtectedDataUnavailableError(message: string | undefined) {
    if (Platform.OS !== 'ios' || !message) return false;
    if (!message.includes('Operation not permitted')) return false;
    if (!PROTECTED_DATA_PREFIXES.some((prefix) => message.startsWith(prefix))) return false;
    // Only while backgrounded. The same error in the foreground is a real problem worth seeing.
    return AppState.currentState !== 'active';
}

export default function initSentry() {
    Sentry.init({
        dsn: appConfig.sentry.dsn,
        debug: false,
        enabled: !__DEV__ && Platform.OS !== 'web',

        beforeSend: (event, hint) => {
            // FetchNotOkError is grouped on its constructor frame, which collapses every non-2xx
            // response from every endpoint into a single issue -- a 401 ends up hidden behind a wave
            // of 5xx, and the issue is titled after whichever event happened to arrive last. Split
            // them by status instead. Duck-typed rather than imported to keep api/util out of the
            // Sentry bootstrap.
            const error = hint?.originalException as { name?: string; status?: number; message?: string } | undefined;
            if (error?.name === 'FetchNotOkError' && error.status) {
                event.fingerprint = ['{{ default }}', 'FetchNotOkError', String(error.status)];
                event.tags = { ...event.tags, httpStatus: String(error.status) };
            }

            if (isProtectedDataUnavailableError(error?.message ?? event.exception?.values?.[0]?.value)) {
                return null;
            }

            return event;
        },

        // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
        // We recommend adjusting this value in production.
        // tracesSampleRate: 1.0,
    });
}
