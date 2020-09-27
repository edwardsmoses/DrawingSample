import {Simplify, Point} from '../Simplify/';
import {line, curveCatmullRom, Line} from 'd3-shape';

const defaultLineGenerator = line()
.x(function (d:any) {
    return d.x;
})
.y(function (d:any) {
    return d.y;
})
    .curve(curveCatmullRom.alpha(0.5));

const Pen = () => {
    let strokes = [];
    let offSetX = 0;
    let offSetY = 0;

    const setStrokes = (_strokes: []) => {
        strokes = _strokes;
    };

    const addStroke = (points) => {
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

    type PointsToSVGProps = {
        points:any,
        tolerance:number,

    }
    const pointsToSVG = (points:any, tolerance:number, lineGenerator:any , highQuality= true) => {
       
            if (points.length > 0) {
                let simplifiedPathPoints = Simplify(points, tolerance, highQuality);
                if (lineGenerator && typeof lineGenerator === 'function') {
                    return lineGenerator(simplifiedPathPoints);
                }
                simplifiedPathPoints.forEach((item) => [item.x, item.y]);
                return defaultLineGenerator([
                simplifiedPathPoints.reduce((item) => [item.x, item.y]);
                ])
            } else {
                return '';
            }
        }
    
        constclear = () => {
            strokes = [];
        };
    }
};


export default class Pen {
    constructor(strokes) {
        this.strokes = strokes || [];
        this._offsetX = 0;
        this._offsetY = 0;
    }

    addStroke(points) {
        if (points.length > 0) {
            this.strokes.push(points);
        }
    }

    rewindStroke() {
        if (this.strokes.length < 1) {
            return;
        }
        this.strokes.pop();
    }

    setOffset(options) {
        if (!options) {
            return;
        }
        this._offsetX = options.x;
        this._offsetY = options.y;
    }

    pointsToSvg(
        points,
        tolerance = 1,
        lineGenerator: Line<[number, number]>,
        highQuality = true,
    ) {
        let offsetX = this._offsetX;
        let offsetY = this._offsetY;
        if (points.length > 0) {
            let simplifiedPathPoints = Simplify(points, tolerance, highQuality);
            if (lineGenerator && typeof lineGenerator === 'function') {
                return lineGenerator(simplifiedPathPoints);
            }
            return defaultLineGenerator(simplifiedPathPoints);
        } else {
            return '';
        }
    }

    clear = () => {
        strokes = [];
    };
}
