/*
 (c) 2017, Vladimir Agafonkin
 Simplify.js, a high-performance JS polyline simplification library
 mourner.github.io/simplify-js
*/

// to suit your point format, run search/replace for '.x' and '.y';
// for 3D version, see 3d branch (configurability would draw significant performance overhead)

type Point = {
    x: number;
    y: number;
};

/** Get Square distance between 2 points */
const getSqDist = (p1: Point, p2: Point) => {
    var dx = p1.x - p2.x,
        dy = p1.y - p2.y;

    return dx * dx + dy * dy;
};

/** square distance from a point to a segment */
const getSqSegDist = (p: Point, p1: Point, p2: Point) => {
    var x = p1.x,
        y = p1.y,
        dx = p2.x - x,
        dy = p2.y - y;

    if (dx !== 0 || dy !== 0) {
        var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);

        if (t > 1) {
            x = p2.x;
            y = p2.y;
        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }

    dx = p.x - x;
    dy = p.y - y;

    return dx * dx + dy * dy;
};
// rest of the code doesn't care about point format

/**  basic distance-based simplification */
const simplifyRadialDist = (points: Point[], sqTolerance: number) => {
    var prevPoint = points[0],
        newPoints = [prevPoint],
        point = null;

    for (var i = 1, len = points.length; i < len; i++) {
        point = points[i];

        if (getSqDist(point, prevPoint) > sqTolerance) {
            newPoints.push(point);
            prevPoint = point;
        }
    }

    if (point && prevPoint !== point) {
        newPoints.push(point);
    }

    return newPoints;
};

/** Not Sure what this is doing
 * TO-DO => Figure it out later
 */
const simplifyDPStep = (
    points: Point[],
    first: number,
    last: number,
    sqTolerance: number,
    simplified: Point[],
) => {
    var maxSqDist = sqTolerance,
        index: number = 0;

    for (var i = first + 1; i < last; i++) {
        var sqDist = getSqSegDist(points[i], points[first], points[last]);

        if (sqDist > maxSqDist) {
            index = i;
            maxSqDist = sqDist;
        }
    }

    if (maxSqDist > sqTolerance) {
        if (index && index - first > 1) {
            simplifyDPStep(points, first, index, sqTolerance, simplified);
        }
        simplified.push(points[index]);
        if (index && last - index > 1) {
            simplifyDPStep(points, index, last, sqTolerance, simplified);
        }
    }
};

/** simplification using Ramer-Douglas-Peucker algorithm */
const simplifyDouglasPeucker = (points: Point[], sqTolerance: number) => {
    var last = points.length - 1;

    var simplified = [points[0]];
    simplifyDPStep(points, 0, last, sqTolerance, simplified);
    simplified.push(points[last]);

    return simplified;
};

/** both algorithms combined for awesome performance */
export const Simplify = (
    points: Point[],
    tolerance: number | undefined,
    highestQuality: Point[],
) => {
    if (points.length <= 2) {
        return points;
    }

    var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

    points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
    points = simplifyDouglasPeucker(points, sqTolerance);

    return points;
};
