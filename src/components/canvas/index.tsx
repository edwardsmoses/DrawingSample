import React from 'react';

import {View, PanResponder, StyleSheet} from 'react-native';

import {Pen} from '../tools/Pen/';

import * as CanvasTypes from './types';

export const Canvas = () => {
    const [canvasState, setCanvasState] = React.useState<
        CanvasTypes.CanvasState
    >({
        AllDrawings: [],
        Coordinates: {
            EndX: 0,
            EndY: 0,
            StartX: 0,
            StartY: 0,
        },
        CurrentPoints: [],
        CurrentUserSelection: null,
        DrawingToolType: CanvasTypes.DrawingType.Pencil,
        NewStroke: [],
        Pen: Pen,
        PreviousStrokes: [],
        UserActions: [],
    });

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
