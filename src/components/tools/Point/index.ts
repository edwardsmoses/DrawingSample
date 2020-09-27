export type PointProps = {
    x: number;
    y: number;
    time: any;
};

export const Point = () => {
    const point: PointProps = {
        x: 0,
        y: 0,
        time: new Date().getTime(),
    };

    const setPoint = (props: PointProps) => {
        point.x = props.x;
        point.y = props.y;
        point.time = props.time;
    };

    const velocityFrom = (start: PointProps) => {
        return point.time !== start.time
            ? distanceTo(start) / (point.time - start.time)
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
        setPoint,
        velocityFrom,
        distanceTo,
        equals,
    };
};
