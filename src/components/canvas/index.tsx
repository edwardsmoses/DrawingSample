import React from 'react';

import {View, PanResponder, StyleSheet} from 'react-native';
import Svg, {G} from 'react-native-svg';

import {Bar} from '../bottombar/Bar';

import {CaptureAndShareScreenshot} from '../screenshot/CaptureScreenShot';

import {CanvasReducer, InitialCanvasState} from './reducer/';

import * as CanvasHandlers from './Handlers';

import {BuildDrawing, DisplayVisualFeedback} from './utils/';

export const Canvas = () => {
  const [state, dispatch] = React.useReducer(CanvasReducer, InitialCanvasState);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (evt) => {
      CanvasHandlers.HandleOnScreenTouch({
        evt,
        dispatch,
        CurrentDrawingType: state.DrawingToolType,
      });
    },
    onPanResponderMove: (evt) => {
      CanvasHandlers.HandleOnScreenMove({
        evt,
        dispatch,
        CurrentDrawingType: state.DrawingToolType,
        state,
      });
    },
    onPanResponderRelease: () => {
      CanvasHandlers.HandleOnScrenRelease({dispatch, state});
    },
  });

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
            {DisplayVisualFeedback(state)}
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
