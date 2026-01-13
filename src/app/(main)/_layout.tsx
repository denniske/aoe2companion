import { Footer } from "@app/components/footer";
import { Header } from "@app/components/header";
import { NavBar } from "@app/components/navbar";
import { TabBar } from "@app/components/tab-bar";
import { useShowTabBar } from "@app/hooks/use-show-tab-bar";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function Layout() {
    const showTabBar = useShowTabBar()

    return (
        <>
            <View className="hidden md:web:block z-10">
                <NavBar />
            </View>
            <Stack
                screenOptions={{ header: (props) => <Header {...props} /> }}
                layout={({ children }) => <View className={showTabBar ? 'flex-1' : 'grow'}>{children}</View>}
            />
            <View className="md:web:hidden">
                <TabBar />
            </View>

            <View className="hidden md:web:block">
                <Footer />
            </View>
        </>
    );
}