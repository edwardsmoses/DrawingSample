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

import * as CanvasHandlers from './Handlers';

import {
  BuildLine,
  ShouldShowLine,
  BuildDrawing,
  ShouldShowCircle,
  BuildCircle,
  ShouldShowPencilPath,
  BuildPencilPath,
} from './utils/';

export const Canvas = () => {
  const [state, dispatch] = React.useReducer(CanvasReducer, InitialCanvasState);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (evt) => {
      onScreenTouch(evt);
    },
    onPanResponderMove: (evt) => {
      onScreenMove(evt);
    },
    onPanResponderRelease: () => {
      onScrenRelease();
    },
  });

  /** Is Called When User Touches Screen */
  const onScreenTouch = (evt: GestureResponderEvent) => {
    switch (state.DrawingToolType) {
      case DrawingType.Pencil:
        CanvasHandlers.HandlePencilOnTouchAndMove({evt, dispatch});
        break;
      case DrawingType.Line:
      case DrawingType.Circle:
        CanvasHandlers.HandleShapeOnTouch({evt, dispatch});
        break;
      default:
        break;
    }
  };

  /** Is Called When User Moves on Screen */
  const onScreenMove = (evt: GestureResponderEvent) => {
    switch (state.DrawingToolType) {
      case DrawingType.Pencil:
        CanvasHandlers.HandlePencilOnTouchAndMove({evt, dispatch});
        break;
      case DrawingType.Line:
      case DrawingType.Circle:
        CanvasHandlers.HandleShapeOnMove({evt, dispatch});
        break;
      case DrawingType.SelectElement:
        CanvasHandlers.HandleCircleOnZoom({evt, state, dispatch});
        break;
      default:
        break;
    }
  };

  /** Is Called When User Releases Touch from Screen */
  const onScrenRelease = () => {
    switch (state.DrawingToolType) {
      case DrawingType.Pencil:
        CanvasHandlers.HandlePencilOnRelease({state, dispatch});
        break;
      case DrawingType.Line:
        CanvasHandlers.HandleLineOnRelease({state, dispatch});
        break;
      case DrawingType.Circle:
        CanvasHandlers.HandleCircleOnRelease({state, dispatch});
        break;
      case DrawingType.SelectElement:
        CanvasHandlers.HandleCircleOnZoomComplete({dispatch});
        break;
      default:
        break;
    }
  };

  const SelectCircleForZoom = (elementIndex: number) => {
    CanvasHandlers.HandleCircleOnPress({state, dispatch, elementIndex});
  };

  const HandleUndo = () => {
    CanvasHandlers.HandleOnUndo({state, dispatch});
  };

  return (
    <React.Fragment>
      <View style={styles.drawCanvasContainer} {...panResponder.panHandlers}>
        <Svg style={styles.drawCanvasContainer}>
          <G>
            {state.DrawingList.map((drawing, index) => {
              return BuildDrawing({
                Drawing: drawing,
                Key: index,
                SelectElement: SelectCircleForZoom,
              });
            })}
            {/* ShowVisual Feedback as user draws */}
            {ShouldShowPencilPath(state.DrawingToolType, state.CurrentPoints) &&
              BuildPencilPath({
                StrokeColor: state.StrokeColor,
                StrokeWidth: state.StrokeWidth,
                Points: state.CurrentPoints,
              })}
            {ShouldShowLine(state.DrawingToolType, state.EndCoordinates) &&
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
                ElementIndex: 0,
                SelectCircle: () => {},
              })}
            {/* #End of Showing Visual Feedback as User Draws */}
          </G>
        </Svg>
      </View>
      <Bar
        currentColor={state.StrokeColor}
        selectColor={(color) =>
          dispatch({type: 'UpdateStrokeColor', newColor: color})
        }
        undoAction={HandleUndo}
        clearAction={() => {
          dispatch({type: 'ClearDrawing'});
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
