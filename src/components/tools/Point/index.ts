export type PointProps = {
    x: number;
    y: number;
    time: any;
};

export const Point = (
    props: PointProps = {x: 0, y: 0, time: new Date().getTime()},
) => {
    const point: PointProps = {
        x: props.x,
        y: props.y,
        time: props.time,
    };

    const velocityFrom = (start: PointProps) => {
        return point.time !== start.time
            ? distanceTo(start) / (props.time - start.time)
            : 1;
    };

    const distanceTo = (start: PointProps) => {
        return Math.sqrt(
            Math.pow(point.x - start.x, 2) + Math.pow(point.y - start.y, 2),
        );
    };

    const equals = (newPoint: PointProps) => {
        return (
            point.x === newPoint.x &&
            point.y === newPoint.y &&
            point.time === newPoint.time
        );
    };

    return {
        point,
        velocityFrom,
        distanceTo,
        equals,
    };
};
