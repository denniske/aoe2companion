import {userIdFromBase} from "../helper/user";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../App";
import {captureScreen} from "react-native-view-shot";
import {sleep} from "../helper/util";



export async function captureImage(navigation:  StackNavigationProp<RootStackParamList, "Main">) {

    // const gotoPlayer = () => {
    //     navigation.push('User', {
    //         id: userIdFromBase(player),
    //         name: player.name,
    //     });
    // };

    await sleep(5 * 1000);
    const uri = await captureScreen({
        format: "jpg",
        quality: 0.8
    });
    console.log("Image saved to", uri);
}

export async function capture(navigation:  StackNavigationProp<RootStackParamList, "Main">) {

    // navigation.push('User', {
    //     id: userIdFromBase(player),
    //     name: player.name,
    // });

    await sleep(5 * 1000);
    const uri = await captureScreen({
        format: "jpg",
        quality: 0.8
    });
    console.log("Image saved to", uri);
}