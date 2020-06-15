import {captureScreen} from "react-native-view-shot";
import {sleep} from "../helper/util";


export async function captureImage(name: string = 'screen') {
    console.log("captureScreen");
    // await sleep(500);
    try {
        const dataUri = await captureScreen({
            format: "jpg",
            quality: 0.8,
            result: "data-uri",
        });
        // Remove line breaks from dataUri on iOS
        const dataUriNormalized = dataUri.replace(/\s/g, '');
        console.log("Image saved");
        // console.log(dataUriNormalized);
        // console.log("Image saved to", uri.substr(0, 20)+'...');
        // const result = await fetch('http://10.0.2.2:3000/', {
        const result = await fetch('http://localhost:3000/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name + '.jpg',
                data: dataUriNormalized,
            })
        });
        console.log(result);
    }catch (e) {
        console.log("Image not saved", e);
    }
}
