import React from 'react';
import {Circle, G, Line} from 'react-native-svg';

import * as Types from '../types';

type BuildShapeProps = {
    Start: Types.Coordinates;
    End: Types.Coordinates;
    StrokeColor: string;
    StrokeWidth: number;
};

/** Build the Drawing (Lines, Circles) */
export const BuildDrawing = (Drawing: Types.Drawing, key: number) => {
    switch (Drawing.Type) {
        case Types.DrawingType.Line:
            return (
                <G key={key}>
                    {BuildLine({
                        Start: Drawing.Info.ShapeStart!,
                        End: Drawing.Info.ShapeEnd!,
                        StrokeColor: Drawing.Info.StrokeColor,
                        StrokeWidth: Drawing.Info.StrokeWidth,
                    })}
                </G>
            );
        case Types.DrawingType.Circle:
            return (
                <G key={key}>
                    {BuildCircle({
                        Start: Drawing.Info.ShapeStart!,
                        End: Drawing.Info.ShapeEnd!,
                        StrokeColor: Drawing.Info.StrokeColor,
                        StrokeWidth: Drawing.Info.StrokeWidth,
                    })}
                </G>
            );
        default:
            return null;
    }
};

/** Build the Line Element  */
export const BuildLine = (props: BuildShapeProps) => {
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

/** Build the Circle Element  */
export const BuildCircle = (props: BuildShapeProps) => {
    const {Start, End, StrokeColor, StrokeWidth} = props;
    return (
        <Circle
            cx={Start.X}
            cy={Start.Y}
            r={CalculateCircleRadius(Start, End)}
            stroke={StrokeColor}
            strokeWidth={StrokeWidth}
        />
    );
};

/** Decide whether to Show Line if Drawing Type is Circle and End Coordinates are greater than Zero */
export const ShouldShowLine = (
    currentDrawingType: Types.DrawingType,
    End: Types.Coordinates,
) => {
    return (
        currentDrawingType === Types.DrawingType.Line && End.X > 0 && End.Y > 0
    );
};

/** Decide whether to Show Circle if Drawing Type is Circle and the Radius of the Circle is Greater than Zero */
export const ShouldShowCircle = (
    currentDrawingType: Types.DrawingType,
    Start: Types.Coordinates,
    End: Types.Coordinates,
) => {
    return (
        currentDrawingType === Types.DrawingType.Circle &&
        CalculateCircleRadius(Start, End) > 0
    );
};

/** Calculate the Radius of Circle */
const CalculateCircleRadius = (
    Start: Types.Coordinates,
    End: Types.Coordinates,
) => {
    const circleRadius = Math.sqrt(
        Math.pow(Start.X - End.X, 2) + Math.pow(Start.Y - End.Y, 2),
    );
    return circleRadius;
};
