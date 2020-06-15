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

    console.log("captureScreen");
    await sleep(500);
    try {
        const uri = await captureScreen({
            format: "jpg",
            quality: 0.8,
            result: "data-uri",
            //result: "zip-base64",
            // result: "tmpfile",
        });
        console.log("Image saved to", uri);
        await fetch('http://10.0.2.2:3000/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'screen-1.jpg',
                data: uri,
            })
        });
    }catch (e) {
        console.log("Image not saved", e);
    }
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