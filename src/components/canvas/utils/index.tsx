import React from 'react';
import {G, Line} from 'react-native-svg';

import * as Types from '../types';

/** Decide whether to Show Visual Line Feedback as the User Moves on the Screen */
export const ShowLineAsUserDraws = (
    currentDrawingType: Types.DrawingType,
    End: Types.Coordinates,
) => {
    return (
        currentDrawingType === Types.DrawingType.Line && End.X > 0 && End.Y > 0
    );
};

type BuildLineProps = {
    Start: Types.Coordinates;
    End: Types.Coordinates;
    StrokeColor: string;
    StrokeWidth: number;
};

/** Build the Line Element  */
export const BuildLine = (props: BuildLineProps) => {
    const {Start, End, StrokeColor, StrokeWidth} = props;
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

export const BuildDrawing = (Drawing: Types.Drawing, key: number) => {
    switch (Drawing.Type) {
        case Types.DrawingType.Line:
            return (
                <G key={key}>
                    {BuildLine({
                        Start: Drawing.Info.LineStart!,
                        End: Drawing.Info.LineEnd!,
                        StrokeColor: Drawing.Info.StrokeColor,
                        StrokeWidth: Drawing.Info.StrokeWidth,
                    })}
                </G>
            );
        default:
            return null;
    }
};
