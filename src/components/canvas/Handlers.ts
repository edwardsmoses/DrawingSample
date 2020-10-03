import {GestureResponderEvent} from 'react-native';
import {CanvasAction} from './reducer/';
import {CanvasState, DrawingType} from './types';

import {
  ShouldShowLine,
  ShouldShowCircle,
  ShouldShowPencilPath,
  PointsToSVG,
  CalculateCircleRadius,
} from './utils/';

type DispatchProp = {
  dispatch: (value: CanvasAction) => void;
};

type EventProp = {
  evt: GestureResponderEvent;
};

type StateProp = {
  state: CanvasState;
};

type HandlerProps = DispatchProp & EventProp;

type HandlerWithStateProps = DispatchProp & StateProp;

type HandlerWithEventAndStateProps = DispatchProp & StateProp & EventProp;

type SelectCircleHandlerProps = HandlerWithStateProps & {
  elementIndex: number;
};

type DrawHandlerProps = EventProp &
  DispatchProp & {
    CurrentDrawingType: DrawingType;
  };

type DrawHandlerWithStateProps = DrawHandlerProps & StateProp;

/** Is Called When User Touches Screen */
export const HandleOnScreenTouch = (props: DrawHandlerProps) => {
  const {evt, dispatch, CurrentDrawingType} = props;
  switch (CurrentDrawingType) {
    case DrawingType.Pencil:
      HandlePencilOnTouchAndMove({evt, dispatch});
      break;
    case DrawingType.Line:
    case DrawingType.Circle:
      HandleShapeOnTouch({evt, dispatch});
      break;
    default:
      break;
  }
};

/** Is Called When User Moves on Screen */
export const HandleOnScreenMove = (props: DrawHandlerWithStateProps) => {
  const {evt, dispatch, CurrentDrawingType, state} = props;
  switch (CurrentDrawingType) {
    case DrawingType.Pencil:
      HandlePencilOnTouchAndMove({evt, dispatch});
      break;
    case DrawingType.Line:
    case DrawingType.Circle:
      HandleShapeOnMove({evt, dispatch});
      break;
    case DrawingType.SelectElement:
      HandleCircleOnZoom({evt, state, dispatch});
      break;
    default:
      break;
  }
};

/** Is Called When User Releases Touch from Screen */
export const HandleOnScrenRelease = (props: HandlerWithStateProps) => {
  const {dispatch, state} = props;
  switch (state.DrawingToolType) {
    case DrawingType.Pencil:
      HandlePencilOnRelease({state, dispatch});
      break;
    case DrawingType.Line:
      HandleLineOnRelease({state, dispatch});
      break;
    case DrawingType.Circle:
      HandleCircleOnRelease({state, dispatch});
      break;
    case DrawingType.SelectElement:
      HandleCircleOnZoomComplete({dispatch});
      break;
    default:
      break;
  }
};

/** When User Selects a Circle */
export const HandleCircleOnPress = (props: SelectCircleHandlerProps) => {
  const {dispatch, state, elementIndex} = props;
  const selectedCircle = state.DrawingList[elementIndex];
  if (selectedCircle) {
    const currentCircleRadius = CalculateCircleRadius(
      selectedCircle.Info.ShapeStart!,
      selectedCircle.Info.ShapeEnd!,
    );
    dispatch({
      type: 'SelectCircleElement',
      SelectInfo: {
        PreviousCircleRadius: currentCircleRadius,
        SelectedCircleIndex: elementIndex,
      },
    });
  }
};

/** When User Presses the Undo Button */
export const HandleOnUndo = (props: HandlerWithStateProps) => {
  const {dispatch, state} = props;
  if (state.UserActions.length === 0) {
    return;
  }

  const LastUserAction = state.UserActions[state.UserActions.length - 1];

  //if the last user action was Selecting a Circle
  if (
    LastUserAction &&
    LastUserAction.ActionType === DrawingType.SelectElement
  ) {
    //update the Circle Info
    dispatch({
      type: 'UpdateCircleElement',
      CircleInfo: {
        CircleIndex: LastUserAction.ActionInfo?.ElementIndex!,
        NewCircleRadius: LastUserAction.ActionInfo?.PreviousCircleRadius!,
      },
    });
    dispatch({type: 'UndoAction', LastActionWasZoom: true});
    return;
  } else {
    dispatch({type: 'UndoAction', LastActionWasZoom: false});
  }
};

/** When User Touches And Moves on Screen for Pencil */
const HandlePencilOnTouchAndMove = (props: HandlerProps) => {
  const {dispatch, evt} = props;
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
const HandleShapeOnTouch = (props: HandlerProps) => {
  const {dispatch, evt} = props;
  dispatch({
    type: 'UpdateStartCoordinates',
    startCoordinates: {
      X: evt.nativeEvent.locationX,
      Y: evt.nativeEvent.locationY,
    },
  });
};

/** When User Moves on  Screen for Shape (Line, Circle) */
const HandleShapeOnMove = (props: HandlerProps) => {
  const {dispatch, evt} = props;
  dispatch({
    type: 'UpdateEndCoordinates',
    endCoordinates: {
      X: evt.nativeEvent.locationX,
      Y: evt.nativeEvent.locationY,
    },
  });
};

/** When User Completes Drawing Line, and Releases On Screen (Line) */
const HandleLineOnRelease = (props: HandlerWithStateProps) => {
  const {dispatch, state} = props;

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
const HandleCircleOnRelease = (props: HandlerWithStateProps) => {
  const {dispatch, state} = props;
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

/** When User Completes Drawing Pencil, and Releases On Screen (Pencil) */
const HandlePencilOnRelease = (props: HandlerWithStateProps) => {
  const {dispatch, state} = props;
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

/** When User is Zooming (Circle) */
const HandleCircleOnZoom = (props: HandlerWithEventAndStateProps) => {
  const {dispatch, state, evt} = props;

  //if nothing was selected
  if (!state.CurrentUserSelection) {
    return;
  }

  const touches = evt.nativeEvent.touches;

  //if two touches on screen, we have a pinch-to-zoom movement.
  if (touches.length >= 2) {
    const [touch1, touch2] = touches;

    //get the element of the current Selected Circle
    const currentSelectedIndex = state.CurrentUserSelection?.ElementIndex!;
    const currentSelectedCircle = state.DrawingList[currentSelectedIndex];

    if (!currentSelectedCircle) {
      return;
    }

    dispatch({
      type: 'UpdateCircleElement',
      CircleInfo: {
        CircleIndex: currentSelectedIndex,
        NewCircleRadius: CalculateCircleRadius(
          {
            X: touch1.pageX,
            Y: touch1.pageY,
          }, //the start coordinates
          {
            X: touch2.pageX,
            Y: touch2.pageY,
          }, //the end coordinates
        ),
      },
    });
  }
};

const HandleCircleOnZoomComplete = (props: DispatchProp) => {
  const {dispatch} = props;
  dispatch({type: 'CompleteCircleZoom'});
};
