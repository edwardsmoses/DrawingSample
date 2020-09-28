import React from 'react';
import {Line} from 'react-native-svg';

import {DrawingType, Coordinates} from '../types';

/** Decide whether to Show Visual Line Feedback as the User Moves on the Screen */
export const ShowLineAsUserDraws = (
    currentDrawingType: DrawingType,
    End: Coordinates,
) => {
    return currentDrawingType === DrawingType.Line && End.X > 0 && End.Y > 0;
};

type BuildLineProps = {
    StartX: number;
    StartY: number;
    EndX: number;
    EndY: number;
    StrokeColor: string;
    StrokeWidth: number;
};

/** Build the Line Element  */
export const BuildLine = (props: BuildLineProps) => {
    const {StartX, StartY, EndX, EndY, StrokeColor, StrokeWidth} = props;
    return (
        <Line
            x1={StartX}
            y1={StartY}
            x2={EndX}
            y2={EndY}
            stroke={StrokeColor}
            strokeWidth={StrokeWidth}
        />
    );
};
