type PointProps = {
    x: number;
    y: number;
    time: any;
};

export const Point = (
    props: PointProps = {x: 0, y: 0, time: new Date().getTime()},
) => {
    let x = props.x,
        y = props.y,
        time = props.time;

    const velocityFrom = (start: PointProps) => {
        return time !== start.time
            ? distanceTo(start) / (props.time - start.time)
            : 1;
    };

    const distanceTo = (start: PointProps) => {
        return Math.sqrt(Math.pow(x - start.x, 2) + Math.pow(y - start.y, 2));
    };

    const equals = (point: PointProps) => {
        return x === point.x && y === point.y && time === point.time;
    };

    return {
        velocityFrom,
        distanceTo,
        equals,
    };
};
