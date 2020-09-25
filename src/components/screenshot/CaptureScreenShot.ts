import {readFile} from 'react-native-fs';
import Share from 'react-native-share';
import {captureScreen} from 'react-native-view-shot';

/** Captures ScreenShot, Reads ScreenShot, and then Shares Shot */
export const CaptureAndShareScreenshot = () => {
    captureScreen().then((uri) => {
        readFile(uri, 'base64').then((res) => {
            let urlString = `data:image/jpeg;base64,${res}`;

            let shareOptions = {
                title: 'GolfPro Share',
                message: 'Share Drawing',
                url: urlString,
                type: 'image/jpeg',
            };
            Share.open(shareOptions)
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    error && console.log(error);
                });
        });
    });
};
