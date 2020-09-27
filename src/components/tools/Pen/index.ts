import {PointProps} from '../Point/';

export const Pen = () => {
    let strokes: any[] = [];

    const setStrokes = (_strokes: []) => {
        strokes = _strokes;
    };

    const addStroke = (points: any) => {
        if (points.length > 0) {
            strokes.push(points);
        }
    };

    const rewindStroke = () => {
        if (strokes.length < 1) {
            return;
        }
        strokes.pop();
    };

    type OffSetOptions = {
        x: number;
        y: number;
    };
    const setOffSet = (options: OffSetOptions) => {
        if (!options) {
            return;
        }
    };

    const pointsToSVG = (points: PointProps[]) => {
        if (points.length > 0) {
            var path = `M ${points[0].x},${points[0].y}`;
            points.forEach((point) => {
                path = path + ` L ${point.x},${point.y}`;
            });
            return path;
        } else {
            return '';
        }
    };

    const clear = () => {
        strokes = [];
    };

    return {
        setStrokes,
        addStroke,
        rewindStroke,
        setOffSet,
        pointsToSVG,
        clear,
    };
};
