import React from 'react';
import {Line} from 'react-native-svg';

import {DrawingType, Coordinates} from '../types';

/** Decide whether to Show Visual Line Feedback as the User Moves on the Screen */
export const ShowLineAsUserDraws = (
    currentDrawingType: DrawingType,
    End: Coordinates,
) => {
    console.log('Here');
    return currentDrawingType === DrawingType.Line && End.X > 0 && End.Y > 0;
};

type BuildLineProps = {
    Start: Coordinates;
    End: Coordinates;
    StrokeColor: string;
    StrokeWidth: number;
};

/** Build the Line Element  */
export const BuildLine = (props: BuildLineProps) => {
    const {Start, End, StrokeColor, StrokeWidth} = props;
    console.log('Draw Line');
    return (
        <Line
            x1={Start.X}
            y1={Start.Y}
            x2={End.X}
            y2={End.Y}
            stroke={StrokeColor}
            strokeWidth={StrokeWidth}
        />
    );
};
