import React from 'react';

import {
    View,
    PanResponder,
    StyleSheet,
    GestureResponderEvent,
} from 'react-native';

import {Bar} from '../bottombar/Bar';

import {CaptureAndShareScreenshot} from '../screenshot/CaptureScreenShot';

import {CanvasReducer, InitialCanvasState} from './reducer/';
import {DrawingType} from './types';

export const Canvas = () => {
    const [state, dispatch] = React.useReducer(
        CanvasReducer,
        InitialCanvasState,
    );

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,

        onPanResponderGrant: (evt, gestureState) => {
            console.log(
                'Touched',
                evt.nativeEvent.locationX,
                evt.nativeEvent.locationY,
            );
            onScreenTouch(evt);
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
                'Release',
                evt.nativeEvent.locationX,
                evt.nativeEvent.locationY,
            );
            console.log('State', state);
        },
    });

    /** When User Touches Screen */
    const onScreenTouch = (evt: GestureResponderEvent) => {
        switch (state.DrawingToolType) {
            case DrawingType.Pencil:
                break;
            case DrawingType.Line:
            case DrawingType.Circle:
                ShapeOnScreenTouch(evt);
                break;
            default:
                break;
        }
    };

    /** When User Touches Screen for Shape (Line, Circle) */
    const ShapeOnScreenTouch = (evt: GestureResponderEvent) => {
        dispatch({
            type: 'UpdateStartCoordinates',
            startCoordinates: {
                X: evt.nativeEvent.locationX,
                Y: evt.nativeEvent.locationY,
            },
        });
    };

    return (
        <React.Fragment>
            <View
                style={styles.drawCanvasContainer}
                {...panResponder.panHandlers}
            />
            <Bar
                currentColor={state.StrokeColor}
                selectColor={(color) =>
                    dispatch({type: 'UpdateStrokeColor', newColor: color})
                }
                undoAction={() => {
                    console.log('Pressed Undo');
                }}
                clearAction={() => {
                    console.log('Pressed Clear');
                }}
                strokeWidth={state.StrokeWidth}
                updateStrokeWidth={(width) =>
                    dispatch({type: 'UpdateStrokeWidth', newStrokeWidth: width})
                }
                currentDrawingType={state.DrawingToolType}
                updateCurrentDrawingType={(type) =>
                    dispatch({type: 'UpdateDrawingType', newDrawingType: type})
                }
                captureScreenShot={CaptureAndShareScreenshot}
            />
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    drawCanvasContainer: {
        flex: 1,
        display: 'flex',
    },
});
