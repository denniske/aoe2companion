import * as Sentry from '@sentry/react-native';
import {appConfig} from "@nex/dataset";

export default function initSentry() {
    if (!__DEV__) {
        Sentry.init({
            dsn: appConfig.sentry.dsn,
            debug: false,

            // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
            // We recommend adjusting this value in production.
            // tracesSampleRate: 1.0,
        });
    }
}
