import {userIdFromBase} from "../helper/user";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../App";
import {captureScreen} from "react-native-view-shot";

export function capture(navigation:  StackNavigationProp<RootStackParamList, "Main">) {

    // const gotoPlayer = () => {
    //     navigation.push('User', {
    //         id: userIdFromBase(player),
    //         name: player.name,
    //     });
    // };

    captureScreen({
        format: "jpg",
        quality: 0.8
    }).then(
        uri => console.log("Image saved to", uri),
        error => console.error("Oops, snapshot failed", error)
    );
}