import React from 'react';

import {View, StyleSheet, Image} from 'react-native';
import {Bar} from './src/components/bottombar/Bar';

import Pad from './src/components/pad/';

const App = () => {
    const selectColor = (color: string) => {
        console.log(color);
        setstrokeColor(color);
    };

    const [strokeColor, setstrokeColor] = React.useState('#000000');

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
                strokeWidth={4}
                onChangeStrokes={(strokes: any) => console.log(strokes)}
            />
            <Bar selectColor={selectColor} undoAction={() => {}} />
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
