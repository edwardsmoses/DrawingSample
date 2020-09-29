import React from 'react';

import {
    View,
    PanResponder,
    StyleSheet,
    GestureResponderEvent,
} from 'react-native';
import Svg, {G, Line} from 'react-native-svg';

import {Bar} from '../bottombar/Bar';

import {CaptureAndShareScreenshot} from '../screenshot/CaptureScreenShot';

import {CanvasReducer, InitialCanvasState} from './reducer/';
import {DrawingType} from './types';

import {BuildLine, ShowLineAsUserDraws} from './utils/';

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
            onScreenMove(evt);
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

    /** Is Called When User Touches Screen */
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

    /** Is Called When User Moves on Screen */
    const onScreenMove = (evt: GestureResponderEvent) => {
        switch (state.DrawingToolType) {
            case DrawingType.Pencil:
                break;
            case DrawingType.Line:
            case DrawingType.Circle:
                ShapeOnScreenMove(evt);
                break;
            default:
                break;
        }
    };

    /** When User Moves on  Screen for Shape (Line, Circle) */
    const ShapeOnScreenMove = (evt: GestureResponderEvent) => {
        dispatch({
            type: 'UpdateEndCoordinates',
            endCoordinates: {
                X: evt.nativeEvent.locationX,
                Y: evt.nativeEvent.locationY,
            },
        });
    };

    return (
        <React.Fragment>
            <View
                style={styles.drawCanvasContainer}
                {...panResponder.panHandlers}>
                <Svg style={styles.drawCanvasContainer}>
                    <G>
                        {ShowLineAsUserDraws(
                            state.DrawingToolType,
                            state.EndCoordinates,
                        ) &&
                            BuildLine({
                                Start: state.StartCoordinates,
                                End: state.EndCoordinates,
                                StrokeColor: state.StrokeColor,
                                StrokeWidth: state.StrokeWidth,
                            })}
                    </G>
                </Svg>
            </View>
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
