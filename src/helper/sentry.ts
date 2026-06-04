import * as Sentry from '@sentry/react-native';
import { appConfig } from '@nex/dataset';
import { Platform } from 'react-native';

export default function initSentry() {
    Sentry.init({
        dsn: appConfig.sentry.dsn,
        debug: false,
        enabled: !__DEV__ && Platform.OS !== 'web',

        beforeSend: (event, hint) => {
            const isHandled = event.exception?.values?.some((ex) => ex.mechanism?.handled === true);
            const message = event.exception?.values?.[0]?.value;

            // Do not report on handled file downloads from cacheLiveActivityAssets()
            if (isHandled && message === 'Unable to download a file: The request timed out.') {
                return null;
            }

            return event;
        },

        // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
        // We recommend adjusting this value in production.
        // tracesSampleRate: 1.0,
    });
}
