import * as Sentry from '@sentry/react-native';
import { appConfig } from '@nex/dataset';
import { Platform } from 'react-native';

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
            const error = hint?.originalException as { name?: string; status?: number } | undefined;
            if (error?.name === 'FetchNotOkError' && error.status) {
                event.fingerprint = ['{{ default }}', 'FetchNotOkError', String(error.status)];
                event.tags = { ...event.tags, httpStatus: String(error.status) };
            }

            return event;
        },

        // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
        // We recommend adjusting this value in production.
        // tracesSampleRate: 1.0,
    });
}
