import {Pen} from '../tools/Pen/';
import {PointProps} from '../tools/Point';

/** The Drawing Types */
export enum DrawingType {
    Pencil = 'Pencil',
    Line = 'Line',
    Circle = 'Circle',
    SelectElement = 'SelectElement',
}

/** The UserActions */
export type UserAction = {
    ActionType: DrawingType;
    ActionInfo: object;
};

/** User Selects Element (Circle) */
export type ElementSelection = {
    ElementIndex: number;
    Element: JSX.Element;
};

export type Coordinates = {
    X: number;
    Y: number;
};

export type DrawingInfo = {
    StrokeWidth: number;
    StrokeColor: string;
    ShapeEnd?: Coordinates;
    ShapeStart?: Coordinates;
};

export type PencilInfo = {
    Start: Coordinates;
    TimeStamp: number;
};

export type Drawing = {
    Type: DrawingType;
    Info: DrawingInfo;
};

export type CanvasState = {
    /** Hold the Line and Circle Drawings */
    AllDrawings: JSX.Element[];

    DrawingList: Drawing[];

    /** Hold the Stroke Color */
    StrokeColor: string;

    /** Hold the Stroke Width */
    StrokeWidth: number;

    /** Hold the UserActions for Undo */
    UserActions: UserAction[];

    /** Hold the Strokes for Pencil Drawings  */
    PreviousStrokes: [];

    NewStroke: [];

    /**Hold the Points that User has Drawn on Screen */
    CurrentPoints: PointProps[];

    /** Hold the Pen used */
    Pen: typeof Pen;

    /** Hold the Drawing Type */
    DrawingToolType: DrawingType;

    /** Store the Start Coordinates when User Touches Screen (Circle, Line) */
    StartCoordinates: Coordinates;

    /** Store the End Coordinates when User Moves on Screen (Circle, Line) */
    EndCoordinates: Coordinates;

    /** Store the User Selection - When User LongPresses on Circle */
    CurrentUserSelection: ElementSelection | null;
};
