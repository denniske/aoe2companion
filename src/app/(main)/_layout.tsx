import { Footer } from "@app/components/footer";
import { Header } from "@app/components/header";
import { NavBar } from "@app/components/navbar";
import { TabBar } from "@app/components/tab-bar";
import { useShowTabBar } from "@app/hooks/use-show-tab-bar";
import { useTabBarPlacement } from "@app/hooks/use-side-tab-bar";
import { Stack } from "expo-router";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "@/src/components/uniwind/safe-area-context";
import { Aoe4DevVariantSwitcher, isAoe4ExplorerRoute } from "@app/view/aoe4-explorer/dev-variant-switcher";

export default function Layout() {
    const showTabBar = useShowTabBar()
    const placement = useTabBarPlacement()
    const insets = useSafeAreaInsets()

    const stack = (
        <Stack
            screenOptions={{ header: (props) => <Header {...props} /> }}
            layout={({ children }) => (
                <View className={showTabBar ? 'flex-1' : 'grow'}>
                    {children}
                </View>
            )}
            screenLayout={({ children, route }) => (
                <View className={showTabBar ? 'flex-1' : 'grow'}>
                    {__DEV__ && isAoe4ExplorerRoute(route.name) && <Aoe4DevVariantSwitcher />}
                    {children}
                    <View className="hidden md:web:block">
                        <Footer />
                    </View>
                </View>
            )}
        />
    );

    // The rail takes the inset on its own side; pad the content on the other.
    if (placement.position === 'side') {
        const railLeft = placement.side === 'left';
        return (
            <View className={railLeft ? 'flex-1 flex-row' : 'flex-1 flex-row-reverse'}>
                <TabBar />
                <View className="flex-1" style={railLeft ? { paddingRight: insets.right } : { paddingLeft: insets.left }}>
                    {stack}
                </View>
            </View>
        );
    }

    // Keep content clear of horizontal insets: the notch in landscape, and on iPhone Duo the
    // vertical rail iOS moves the status bar into. The tab bar pads itself.
    if (Platform.OS !== 'web') {
        return (
            <>
                <View className="flex-1" style={{ paddingLeft: insets.left, paddingRight: insets.right }}>{stack}</View>
                <TabBar />
            </>
        );
    }

    return (
        <>
            <View className="hidden md:web:block z-10">
                <NavBar />
            </View>
            {stack}
            <View className="md:web:hidden">
                <TabBar />
            </View>
        </>
    );
}
