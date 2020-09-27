type PointProps = {
    x: number;
    y: number;
    time: any;
};

export const Point = (props: PointProps) => {
    const velocityFrom = (start: PointProps) => {
        return props.time !== start.time
            ? distanceTo(start) / (props.time - start.time)
            : 1;
    };

    const distanceTo = (start: PointProps) => {
        return Math.sqrt(
            Math.pow(props.x - start.x, 2) + Math.pow(props.y - start.y, 2),
        );
    };

    const equals = (point: PointProps) => {
        return (
            props.x === point.x &&
            props.y === point.y &&
            props.time === point.time
        );
    };
};
