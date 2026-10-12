import { Footer } from "@app/components/footer";
import { Header } from "@app/components/header";
import { NavBar } from "@app/components/navbar";
import { TabBar } from "@app/components/tab-bar";
import { useShowTabBar } from "@app/hooks/use-show-tab-bar";
import { Stack } from "expo-router";
import { View } from "react-native";
import { Aoe4DevVariantSwitcher, isAoe4ExplorerRoute } from "@app/view/aoe4-explorer/dev-variant-switcher";

export default function Layout() {
    const showTabBar = useShowTabBar()

    return (
        <>
            <View className="hidden md:web:block z-10">
                <NavBar />
            </View>
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
            <View className="md:web:hidden">
                <TabBar />
            </View>
        </>
    );
}