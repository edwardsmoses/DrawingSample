import * as Types from '../types';
import {Pen} from '../../tools/Pen/';

export const InitialCanvasState: Types.CanvasState = {
    AllDrawings: [],
    Coordinates: {
        EndX: 0,
        EndY: 0,
        StartX: 0,
        StartY: 0,
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
    | {type: 'UpdateDrawingType'; newDrawingType: Types.DrawingType};

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
        default:
            throw new Error();
    }
};
