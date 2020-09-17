import React from 'react';

import {View, StyleSheet} from 'react-native';
import {Bar} from './src/components/bottombar/Bar';

import Pad from './src/components/pad/';

const App = () => {
    const selectColor = (color: string) => {
        console.log('Pressed');
        console.log(color);
    };

    return (
        <View style={styles.MainContainer}>
            <Pad
                strokes={[]}
                containerStyle={styles.padView}
                rewind={(undo: any) => {
                    console.log(undo);
                }}
                clear={(clear: any) => {
                    console.log(clear);
                }}
                color={'#000000'}
                strokeWidth={4}
                onChangeStrokes={(strokes: any) => console.log(strokes)}
            />
            <Bar selectColor={selectColor} undoAction={() => {}} />
        </View>
    );
};

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
    },
    padView: {
        backgroundColor: 'rgba(0,0,0,0.01)',
    },
});

export default App;
