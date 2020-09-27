import {Pen} from '../tools/Pen/';

/** The Drawing Types */
enum DrawingType {
    Pencil = 'Pencil',
    Line = 'Line',
    Circle = 'Circle',
    SelectElement = 'SelectElement',
}

/** The UserActions */
type UserAction = {
    ActionType: DrawingType;
    ActionInfo: object;
};

/** User Selects Element (Circle) */
type ElementSelection = {
    ElementIndex: number;
    Element: React.ReactNode;
};

type Coordinates = {
    StartX: number;
    StartY: number;
    EndX: number;
    EndY: number;
};

type CanvasState = {
    /** Hold the Line and Circle Drawings */
    AllDrawings: React.ReactNode[];

    /** Hold the UserActions for Undo */
    UserActions: UserAction[];

    /** Hold the Strokes for Pencil Drawings  */
    PreviousStrokes: [];

    NewStroke: [];

    /**Hold the Points that User has Drawn on Screen */
    CurrentPoints: [];

    /** Hold the Pen used */
    Pen: typeof Pen;

    /** Hold the Drawing Type */
    DrawingToolType: DrawingType;

    /** Store the Coordinates as User Touches and Moves on Screen (Circle, Line) */
    Coordinates: Coordinates;

    /** Store the User Selection - When User LongPresses on Circle */
    CurrentUserSelection: ElementSelection | null;
};
