// Web/non-iOS stub for the MatchActivity Live Activity.
// The real implementation (AAMatchActivity.widget.tsx) imports `@expo/ui/swift-ui`, which calls
// requireNativeViewManager at module load and is not available off-iOS. This stub keeps the
// shared `import '@app/widgets/AAMatchActivity.widget'` in _layout.tsx safe on web/android.
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
