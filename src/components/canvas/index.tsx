import React from 'react';

import {View, PanResponder, StyleSheet} from 'react-native';

export const Canvas = () => {
    const panResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                console.log(
                    'Touched',
                    evt.nativeEvent.locationX,
                    evt.nativeEvent.locationY,
                );
            },
            onPanResponderMove: (evt, gestureState) => {
                console.log(
                    'Moved',
                    evt.nativeEvent.locationX,
                    evt.nativeEvent.locationY,
                );
            },
            onPanResponderRelease: (evt, gestureState) => {
                console.log(
                    'Released',
                    evt.nativeEvent.locationX,
                    evt.nativeEvent.locationY,
                );
            },
        }),
    ).current;

    return (
        <View
            style={styles.drawCanvasContainer}
            {...panResponder.panHandlers}
        />
    );
};

const styles = StyleSheet.create({
    drawCanvasContainer: {
        flex: 1,
        display: 'flex',
    },
});
