import React from 'react';

import ViewShot, {captureRef} from 'react-native-view-shot';
import {readFile} from 'react-native-fs';
import Share from 'react-native-share';

type ShotProps = {
    Child: React.ComponentType;
};

const useCapture = () => {
    const viewShotRef = React.useRef<ViewShot>(null);

    /** Captures ScreenShot, Reads ScreenShot, and then Shares Shot */
    const captureAndShareScreenshot = () => {
        captureRef(viewShotRef).then((uri) => {
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

    return {
        viewShotRef,
        captureAndShareScreenshot,
    };
};

export const Shot = (props: ShotProps) => {
    const {Child} = props;

    const {viewShotRef, captureAndShareScreenshot} = useCapture();

    const ViewWithScreenShot = (childProps: any) => {
        return (
            <ViewShot ref={viewShotRef} options={{format: 'jpg', quality: 0.9}}>
                <Child
                    {...childProps}
                    onCaptureScreenShot={captureAndShareScreenshot}
                />
            </ViewShot>
        );
    };

    return ViewWithScreenShot;
};
