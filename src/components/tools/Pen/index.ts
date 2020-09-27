export type Point = {
    x: number;
    y: number;
};


export const Pen = () => {
    let strokes = [];
    let offSetX = 0;
    let offSetY = 0;

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
        offSetX = options.x;
        offSetY = options.y;
    };

    const pointsToSVG = (points: Point[]) => {
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
    };
};
