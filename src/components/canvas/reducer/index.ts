import * as Types from '../types';
import {Pen} from '../../tools/Pen/';

export const InitialCanvasState: Types.CanvasState = {
    AllDrawings: [],
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

export type CanvasAction =
    | {type: 'UpdateStrokeColor'; newColor: string}
    | {type: 'UpdateStrokeWidth'; newStrokeWidth: number}
    | {type: 'UpdateDrawingType'; newDrawingType: Types.DrawingType}
    | {type: 'UpdateStartCoordinates'; startCoordinates: Types.Coordinates}
    | {type: 'UpdateEndCoordinates'; endCoordinates: Types.Coordinates};

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

        default:
            throw new Error();
    }
};
