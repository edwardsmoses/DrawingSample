import React from 'react';

import {View, StyleSheet, Image} from 'react-native';
import Svg, {Path} from 'react-native-svg';

import Pad from './src/components/pad/';

const App = () => {
    const selectColor = (color: string) => {
        console.log(color);
        setstrokeColor(color);
    };

    const updateStrokeWidth = (value: number) => {
        setStrokeWidth(value);
    };

    const [strokeColor, setstrokeColor] = React.useState('#000000');
    const [strokeWidth, setStrokeWidth] = React.useState(4);

    return (
        <View style={styles.mainContainer}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('./src/assets/playingGolf.png')}
                    style={styles.backgroundImage}
                />
            </View>

            <Pad
                strokes={[]}
                containerStyle={styles.padView}
                rewind={(undo: any) => {
                    console.log(undo);
                }}
                clear={(clear: any) => {
                    console.log(clear);
                }}
                color={strokeColor}
                updateColor={selectColor}
                strokeWidth={strokeWidth}
                updateStrokeWidth={updateStrokeWidth}
                onChangeStrokes={(strokes: any) => console.log(strokes)}
            />
            {/* <Svg viewBox="-16 -16 544 544">
                <Path
                    stroke="#000000"
                    strokeWidth={4}
                    fill="none"
                    d="M 10 10 H 90 V 90 H 10 L 10 10"
                />
            </Svg> */}
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    padView: {
        backgroundColor: 'rgba(0,0,0,0.01)',
    },
});

export default App;
