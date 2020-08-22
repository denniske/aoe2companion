import * as Sentry from 'sentry-expo';

export default function initSentry() {
    if (!__DEV__) {
        Sentry.init({
            dsn: 'https://9081bd9af23c4367b6023a6b62d48164@o329359.ingest.sentry.io/5382944',
            enableInExpoDevelopment: false,
            debug: false,
        });
    }
}
