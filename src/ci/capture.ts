import {captureScreen} from "react-native-view-shot";
import {Platform} from 'react-native';

export async function captureImage(path: string = 'screen') {
    console.log("Image capture");
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

        const host = Platform.select({ios: 'localhost', android: '10.0.2.2'});
        const screenshotsEndpoint = `http://${host}:3000/`;
        const result = await fetch(screenshotsEndpoint, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: Platform.OS + '/' + path + '.jpg',
                data: dataUriNormalized,
            })
        });
        console.log("Image sent");
    }catch (e) {
        console.log("Image not saved or sent", e);
    }
}
