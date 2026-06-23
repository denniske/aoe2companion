// Android stub for the MatchActivity Live Activity (iOS-only feature).
// See AAMatchActivity.widget.web.tsx for the rationale — the native .tsx imports `@expo/ui/swift-ui`
// (iOS only), so non-iOS platforms must resolve to this inert stub instead.
const noopInstance = {
    async update(_props: unknown) {},
    async end(_dismissalPolicy?: unknown, _props?: unknown, _contentDate?: unknown) {},
    async getPushToken(): Promise<string | null> {
        return null;
    },
    addPushTokenListener(_listener: (...args: unknown[]) => void) {
        return { remove() {} };
    },
};

const MatchActivity = {
    start(_props: unknown, _url?: string) {
        return noopInstance;
    },
    getInstances() {
        return [] as (typeof noopInstance)[];
    },
};

export default MatchActivity;
