import * as Types from '../types';

/** Initial State for the Drawing Canvas */
export const InitialCanvasState: Types.CanvasState = {
  DrawingList: [],
  StartCoordinates: {
    X: 0,
    Y: 0,
  },
  EndCoordinates: {
    X: 0,
    Y: 0,
  },
  StrokeColor: '#131113',
  StrokeWidth: 4,

  CurrentPoints: [],
  CurrentUserSelection: null,
  DrawingToolType: Types.DrawingType.Pencil,
  UserActions: [],
};

/** The Action Types for Drawing Canvas */
export type CanvasAction =
  | {type: 'UpdateStrokeColor'; newColor: string}
  | {type: 'UpdateStrokeWidth'; newStrokeWidth: number}
  | {type: 'UpdateDrawingType'; newDrawingType: Types.DrawingType}
  | {type: 'UpdateStartCoordinates'; startCoordinates: Types.Coordinates}
  | {type: 'UpdateEndCoordinates'; endCoordinates: Types.Coordinates}
  | {type: 'CompleteLineDrawing'; LineInfo: Types.DrawingInfo}
  | {type: 'CompleteCircleDrawing'; CircleInfo: Types.DrawingInfo}
  | {type: 'TouchPencilDrawing'; PencilInfo: Types.PencilInfo}
  | {type: 'CompletePencilDrawing'; PencilInfo: Types.DrawingInfo}
  | {type: 'SelectCircleElement'; SelectInfo: Types.SelectCircleInfo}
  | {type: 'UpdateCircleElement'; CircleInfo: Types.UpdateCircleInfo}
  | {type: 'UndoAction'; LastActionWasZoom: boolean}
  | {type: 'CompleteCircleZoom'}
  | {type: 'ClearDrawing'};

/** The Reducer for Drawing Canvas */
export const CanvasReducer = (
  state: Types.CanvasState,
  action: CanvasAction,
): Types.CanvasState => {
  switch (action.type) {
    case 'UpdateStrokeColor':
      return {...state, StrokeColor: action.newColor};
    case 'UpdateStrokeWidth':
      return {...state, StrokeWidth: action.newStrokeWidth};
    case 'UpdateDrawingType':
      return {...state, DrawingToolType: action.newDrawingType};
    case 'UpdateStartCoordinates':
      return {...state, StartCoordinates: action.startCoordinates};
    case 'UpdateEndCoordinates':
      return {...state, EndCoordinates: action.endCoordinates};
    case 'CompleteLineDrawing':
      return CompleteLineDrawing(state, action);
    case 'CompleteCircleDrawing':
      return CompleteCircleDrawing(state, action);
    case 'TouchPencilDrawing': {
      return TouchPencilDrawing(state, action);
    }
    case 'CompletePencilDrawing': {
      return CompletePencilDrawing(state, action);
    }
    case 'SelectCircleElement': {
      return SelectCircleElement(state, action);
    }
    case 'UpdateCircleElement': {
      return UpdateCircleElement(state, action);
    }
    case 'CompleteCircleZoom': {
      return CompleteCircleZoom(state);
    }
    case 'ClearDrawing': {
      return ClearDrawing(state);
    }
    case 'UndoAction': {
      return UndoAction(state, action);
    }
    default:
      throw new Error();
  }
};

/** Undo Action Reducer */
const UndoAction = (
  state: Types.CanvasState,
  action: {type: 'UndoAction'; LastActionWasZoom: boolean},
) => {
  return {
    ...state,
    DrawingList: action.LastActionWasZoom
      ? state.DrawingList
      : state.DrawingList.filter((_, i) => i !== state.DrawingList.length - 1),
    UserActions: state.UserActions.filter(
      (_, i) => i !== state.UserActions.length - 1,
    ),
  };
};

/** Clear All Drawing Action Reducer */
const ClearDrawing = (state: Types.CanvasState): Types.CanvasState => {
  return {
    ...state,
    DrawingList: [],
    UserActions: [],
    CurrentPoints: [],
    EndCoordinates: {X: 0, Y: 0},
    StartCoordinates: {X: 0, Y: 0},
  };
};

/** Complete Circle Zoom Action Reducer  */
const CompleteCircleZoom = (state: Types.CanvasState): Types.CanvasState => {
  return {
    ...state,
    DrawingToolType: Types.DrawingType.Circle,
    CurrentUserSelection: null,
  };
};

/** Update Circle Element Action Reducer */
const UpdateCircleElement = (
  state: Types.CanvasState,
  action: {type: 'UpdateCircleElement'; CircleInfo: Types.UpdateCircleInfo},
): Types.CanvasState => {
  return {
    ...state,
    DrawingList: state.DrawingList.map((drawing, i) =>
      i === action.CircleInfo.CircleIndex
        ? {
            ...drawing,
            Info: {
              ...drawing.Info,
              CircleRadius: action.CircleInfo.NewCircleRadius,
            },
          }
        : drawing,
    ),
  };
};

/** When User Selects Circle Action Reducer */
const SelectCircleElement = (
  state: Types.CanvasState,
  action: {type: 'SelectCircleElement'; SelectInfo: Types.SelectCircleInfo},
): Types.CanvasState => {
  return {
    ...state,
    UserActions: [
      ...state.UserActions,
      {
        ActionType: Types.DrawingType.SelectElement,
        ActionInfo: {
          ElementIndex: action.SelectInfo.SelectedCircleIndex,
          PreviousCircleRadius: action.SelectInfo.PreviousCircleRadius,
        },
      },
    ],
    CurrentUserSelection: {
      ElementIndex: action.SelectInfo.SelectedCircleIndex,
    },
    DrawingToolType: Types.DrawingType.SelectElement,
  };
};

/** When User Completes Pencil Drawing Action Reducer */
const CompletePencilDrawing = (
  state: Types.CanvasState,
  action: {type: 'CompletePencilDrawing'; PencilInfo: Types.DrawingInfo},
): Types.CanvasState => {
  return {
    ...state,
    DrawingList: [
      ...state.DrawingList,
      {Type: Types.DrawingType.Pencil, Info: action.PencilInfo},
    ],
    UserActions: [...state.UserActions, {ActionType: Types.DrawingType.Pencil}],
    CurrentPoints: [],
    EndCoordinates: {X: 0, Y: 0},
    StartCoordinates: {X: 0, Y: 0},
  };
};

/** When User is Touches and Moves on Screen Action Reducer */
const TouchPencilDrawing = (
  state: Types.CanvasState,
  action: {type: 'TouchPencilDrawing'; PencilInfo: Types.PencilInfo},
): Types.CanvasState => {
  return {
    ...state,
    CurrentPoints: [...state.CurrentPoints, action.PencilInfo.Start],
  };
};

/** When User Completes Drawing Circle Action Reducer */
const CompleteCircleDrawing = (
  state: Types.CanvasState,
  action: {type: 'CompleteCircleDrawing'; CircleInfo: Types.DrawingInfo},
): Types.CanvasState => {
  return {
    ...state,
    DrawingList: [
      ...state.DrawingList,
      {Type: Types.DrawingType.Circle, Info: action.CircleInfo},
    ],
    UserActions: [...state.UserActions, {ActionType: Types.DrawingType.Circle}],
    EndCoordinates: {X: 0, Y: 0},
    StartCoordinates: {X: 0, Y: 0},
  };
};

/** When User Completes Drawing Line Action Reducer */
const CompleteLineDrawing = (
  state: Types.CanvasState,
  action: {type: 'CompleteLineDrawing'; LineInfo: Types.DrawingInfo},
): Types.CanvasState => {
  return {
    ...state,
    DrawingList: [
      ...state.DrawingList,
      {Type: Types.DrawingType.Line, Info: action.LineInfo},
    ],
    UserActions: [...state.UserActions, {ActionType: Types.DrawingType.Line}],
    EndCoordinates: {X: 0, Y: 0},
    StartCoordinates: {X: 0, Y: 0},
  };
};
