import React from 'react';

import {
    View,
    PanResponder,
    StyleSheet,
    GestureResponderEvent,
} from 'react-native';
import Svg, {G} from 'react-native-svg';

import {Bar} from '../bottombar/Bar';

import {CaptureAndShareScreenshot} from '../screenshot/CaptureScreenShot';

import {CanvasReducer, InitialCanvasState} from './reducer/';
import {DrawingType} from './types';

import {
    BuildLine,
    ShouldShowLine,
    BuildDrawing,
    ShouldShowCircle,
    BuildCircle,
    ShouldShowPencilPath,
    BuildPencilPath,
    PointsToSVG,
} from './utils/';

export const Canvas = () => {
    const [state, dispatch] = React.useReducer(
        CanvasReducer,
        InitialCanvasState,
    );

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,

        onPanResponderGrant: (evt) => {
            console.log(
                'Touched',
                evt.nativeEvent.locationX,
                evt.nativeEvent.locationY,
            );
            onScreenTouch(evt);
        },
        onPanResponderMove: (evt) => {
            console.log(
                'Moved',
                evt.nativeEvent.locationX,
                evt.nativeEvent.locationY,
            );
            onScreenMove(evt);
        },
        onPanResponderRelease: (evt) => {
            console.log(
                'Release',
                evt.nativeEvent.locationX,
                evt.nativeEvent.locationY,
            );
            onScrenRelease();
        },
    });

    //#region PanResponder Functions

    /** Is Called When User Touches Screen */
    const onScreenTouch = (evt: GestureResponderEvent) => {
        switch (state.DrawingToolType) {
            case DrawingType.Pencil:
                PencilOnScreenTouchAndMove(evt);
                break;
            case DrawingType.Line:
            case DrawingType.Circle:
                ShapeOnScreenTouch(evt);
                break;
            default:
                break;
        }
    };

    /** Is Called When User Moves on Screen */
    const onScreenMove = (evt: GestureResponderEvent) => {
        switch (state.DrawingToolType) {
            case DrawingType.Pencil:
                PencilOnScreenTouchAndMove(evt);
                break;
            case DrawingType.Line:
            case DrawingType.Circle:
                ShapeOnScreenMove(evt);
                break;
            default:
                break;
        }
    };

    /** Is Called When User Releases Touch from Screen */
    const onScrenRelease = () => {
        console.log('CanvasState', state);
        switch (state.DrawingToolType) {
            case DrawingType.Pencil:
                PencilOnScreenRelease();
                break;
            case DrawingType.Line:
                LineOnScreenRelease();
                break;
            case DrawingType.Circle:
                CircleOnScreenRelease();
                break;
            default:
                break;
        }
    };
    //#endregion

    /** When User Touches And Moves on Screen for Pencil */
    const PencilOnScreenTouchAndMove = (evt: GestureResponderEvent) => {
        dispatch({
            type: 'TouchPencilDrawing',
            PencilInfo: {
                TimeStamp: evt.nativeEvent.timestamp,
                Start: {
                    X: evt.nativeEvent.locationX,
                    Y: evt.nativeEvent.locationY,
                },
            },
        });
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

    /** When User Completes Drawing Line, and Releases On Screen (Line) */
    const LineOnScreenRelease = () => {
        if (!ShouldShowLine(state.DrawingToolType, state.EndCoordinates)) {
            return;
        }

        //update the State
        dispatch({
            type: 'CompleteLineDrawing',
            LineInfo: {
                ShapeEnd: state.EndCoordinates,
                ShapeStart: state.StartCoordinates,
                StrokeColor: state.StrokeColor,
                StrokeWidth: state.StrokeWidth,
            },
        });
    };

    /** When User Completes Drawing Circle, and Releases On Screen (Circle) */
    const CircleOnScreenRelease = () => {
        if (
            !ShouldShowCircle(
                state.DrawingToolType,
                state.StartCoordinates,
                state.EndCoordinates,
            )
        ) {
            return;
        }

        //update the State
        dispatch({
            type: 'CompleteCircleDrawing',
            CircleInfo: {
                ShapeEnd: state.EndCoordinates,
                ShapeStart: state.StartCoordinates,
                StrokeColor: state.StrokeColor,
                StrokeWidth: state.StrokeWidth,
            },
        });
    };

    const PencilOnScreenRelease = () => {
        if (!ShouldShowPencilPath(state.DrawingToolType, state.CurrentPoints)) {
            return;
        }

        const points = state.CurrentPoints;
        if (points.length === 1) {
            let p = points[0];
            let distance = Math.sqrt(state.StrokeWidth || 4) / 2;
            points.push({X: p.X + distance, Y: p.Y + distance});
        }

        dispatch({
            type: 'CompletePencilDrawing',
            PencilInfo: {
                StrokeColor: state.StrokeColor,
                StrokeWidth: state.StrokeWidth,
                PencilPath: PointsToSVG(points),
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
                        {state.DrawingList.map((drawing, index) => {
                            return BuildDrawing(drawing, index);
                        })}

                        {ShouldShowPencilPath(
                            state.DrawingToolType,
                            state.CurrentPoints,
                        ) &&
                            BuildPencilPath({
                                StrokeColor: state.StrokeColor,
                                StrokeWidth: state.StrokeWidth,
                                Points: state.CurrentPoints,
                            })}

                        {ShouldShowLine(
                            state.DrawingToolType,
                            state.EndCoordinates,
                        ) &&
                            BuildLine({
                                Start: state.StartCoordinates,
                                End: state.EndCoordinates,
                                StrokeColor: state.StrokeColor,
                                StrokeWidth: state.StrokeWidth,
                            })}

                        {ShouldShowCircle(
                            state.DrawingToolType,
                            state.StartCoordinates,
                            state.EndCoordinates,
                        ) &&
                            BuildCircle({
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
                    dispatch({type: 'ClearDrawing'})
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
