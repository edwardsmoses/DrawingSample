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
    StrokeColor: '#000000',
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
    | {type: 'UpdateCircleElementOnZoom'; CircleInfo: Types.UpdateCircleInfo}
    | {type: 'ClearDrawing'}
    | {type: 'UndoAction'};

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
            return {
                ...state,
                DrawingList: [
                    ...state.DrawingList,
                    {Type: Types.DrawingType.Line, Info: action.LineInfo},
                ], //add the New Line Info to the Drawing.
                UserActions: [
                    ...state.UserActions,
                    {ActionType: Types.DrawingType.Line, ActionInfo: {}},
                ], //add the Line Drawn to UserActions (for Undo)
                EndCoordinates: {X: 0, Y: 0}, //Reset the EndCoordinates
                StartCoordinates: {X: 0, Y: 0}, //Reset the StartCoordinates
            };
        case 'CompleteCircleDrawing':
            return {
                ...state,
                DrawingList: [
                    ...state.DrawingList,
                    {Type: Types.DrawingType.Circle, Info: action.CircleInfo},
                ], //add the New Circle Info to the Drawing.
                UserActions: [
                    ...state.UserActions,
                    {ActionType: Types.DrawingType.Circle, ActionInfo: {}},
                ], //add the Circle Drawn to UserActions (for Undo)
                EndCoordinates: {X: 0, Y: 0}, //Reset the EndCoordinates
                StartCoordinates: {X: 0, Y: 0}, //Reset the StartCoordinates
            };
        case 'TouchPencilDrawing': {
            return {
                ...state,
                CurrentPoints: [
                    ...state.CurrentPoints,
                    action.PencilInfo.Start,
                ],
            };
        }
        case 'CompletePencilDrawing': {
            return {
                ...state,
                DrawingList: [
                    ...state.DrawingList,
                    {Type: Types.DrawingType.Pencil, Info: action.PencilInfo},
                ], //add the New Pencil Info to the Drawing.
                UserActions: [
                    ...state.UserActions,
                    {ActionType: Types.DrawingType.Pencil, ActionInfo: {}},
                ], //add the Pencil Drawn to UserActions (for Undo)
                CurrentPoints: [], //clear the Current Points...
                EndCoordinates: {X: 0, Y: 0}, //Reset the EndCoordinates
                StartCoordinates: {X: 0, Y: 0}, //Reset the StartCoordinates
            };
        }
        case 'SelectCircleElement': {
            return {
                ...state,
                UserActions: [
                    ...state.UserActions,
                    {
                        ActionType: Types.DrawingType.SelectElement,
                        ActionInfo: {
                            CircleRadius:
                                action.SelectInfo.PreviousCircleRadius,
                        },
                    },
                ], //Save the Current Radius of the Circle (For Undo)
                CurrentUserSelection: {
                    ElementIndex: action.SelectInfo.SelectedCircleIndex,
                }, //Save the Selected Circle Index
                DrawingToolType: Types.DrawingType.SelectElement, //Update the Drawing Type to Select Element
            };
        }
        case 'UpdateCircleElementOnZoom': {
            return {
                ...state,
                DrawingList: state.DrawingList.map((drawing, i) =>
                    i === action.CircleInfo.CircleIndex
                        ? {
                              ...drawing,
                              Info: {
                                  ...drawing.Info,
                                  CircleRadius:
                                      action.CircleInfo.NewCircleRadius,
                              },
                          }
                        : drawing,
                ),
            };
        }
        case 'ClearDrawing': {
            return {
                ...state,
                DrawingList: [],
                UserActions: [],
                CurrentPoints: [],
                EndCoordinates: {X: 0, Y: 0}, //Reset the EndCoordinates
                StartCoordinates: {X: 0, Y: 0}, //Reset the StartCoordinates
            };
        }
        case 'UndoAction': {
            if (state.UserActions.length === 0) {
                return state;
            }
            return {
                ...state,
                DrawingList: state.DrawingList.filter(
                    (_, i) => i !== state.DrawingList.length - 1,
                ), //remove the last element of the Drawing List
                UserActions: state.UserActions.filter(
                    (_, i) => i !== state.UserActions.length - 1,
                ), //remove the last element of the UserActions
            };
        }
        default:
            throw new Error();
    }
};
