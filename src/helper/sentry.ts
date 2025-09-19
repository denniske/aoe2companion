import * as Sentry from '@sentry/react-native';
import { appConfig } from '@nex/dataset';
import { Platform } from 'react-native';

export default function initSentry() {
    Sentry.init({
        dsn: appConfig.sentry.dsn,
        debug: false,
        enabled: !__DEV__ && Platform.OS !== 'web',

        // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
        // We recommend adjusting this value in production.
        // tracesSampleRate: 1.0,
    });
}
