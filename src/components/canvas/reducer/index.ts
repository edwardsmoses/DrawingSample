import * as Types from '../types';
import {Pen} from '../../tools/Pen/';

/** Initial State for the Drawing Canvas */
export const InitialCanvasState: Types.CanvasState = {
    AllDrawings: [],
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
    NewStroke: [],
    Pen: Pen,
    PreviousStrokes: [],
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
    | {type: 'CompleteCircleDrawing'; CircleInfo: Types.DrawingInfo};

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
        default:
            throw new Error();
    }
};
