import React from 'react';
import {View, PanResponder, StyleSheet, InteractionManager} from 'react-native';
import Svg, {G, Path, Circle, Line} from 'react-native-svg';
import Pen from '../tools/pen';

import {Bar} from '../bottombar/Bar';

import humps from 'humps';
import {debounce} from 'lodash';

import * as DrawType from '../tools/DrawType';

import {CaptureAndShareScreenshot} from '../screenshot/CaptureScreenShot';

export const convertStrokesToSvg = (strokes, layout = {}) => {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${layout.width}" height="${
        layout.height
    }" version="1.1">
        <g>
          ${strokes
              .map((e) => {
                  return `<${e.type.toLowerCase()} ${Object.keys(e.attributes)
                      .map((a) => {
                          return `${humps.decamelize(a, {separator: '-'})}="${
                              e.attributes[a]
                          }"`;
                      })
                      .join(' ')}/>`;
              })
              .join('\n')}
        </g>
      </svg>
    `;
};

export default class Whiteboard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            allDrawings: [], //hold Line and Circle Drawings
            whatUserLastDrew: [], //to know what to remove from screen, on press of undo
            currentPoints: [],
            previousStrokes: this.props.strokes || [],
            newStroke: [],
            pen: new Pen(),
            drawingToolType: DrawType.Pencil, //hold the drawingType (Pencil, Circle, Line)
            startX: 0, //hold the startX of when user Touches Screen
            startY: 0, //hold the startY of when user Touches Screen
            endX: 0, //hold the endX of when user is moving on Screen
            endY: 0, //hold the endY of when user is moving on Screen
            didUserLongPressCircle: false, //know when user longPresses on a Circle
            currentUserSelectedCircle: {}, //hold the Circle that the User Selected
        };

        //the PanResponder, and it's events.
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gs) => true,
            onMoveShouldSetPanResponder: (evt, gs) => true,
            onPanResponderGrant: (evt, gs) => this.onResponderGrant(evt, gs), //when user touches screen
            onPanResponderMove: (evt, gs) => this.onResponderMove(evt, gs), //when user is moving on the screen
            onPanResponderRelease: (evt, gs) =>
                this.onResponderRelease(evt, gs), //when the user releases his touch
        });
        const rewind = props.rewind || function () {};
        const clear = props.clear || function () {};
        this._clientEvents = {
            rewind: rewind(this.rewind),
            clear: clear(this.clear),
        };

        this.updateStrokes = debounce(this.updateStrokes.bind(this), 50, {
            leading: true,
            trailing: true,
            maxWait: 100,
        });

        this._onChangeStrokes = debounce(
            this._onChangeStrokes.bind(this),
            100,
            {
                leading: true,
                trailing: true,
                maxWait: 1000,
            },
        );
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (
            nextProps.strokes &&
            prevState.previousStrokes &&
            nextProps.strokes !== prevState.previousStrokes
        ) {
            return {
                previousStrokes: prevState.previousStrokes,
                newStroke: [],
            };
        }
        return null;
    }

    /** When User Presses the Undo Button */
    rewind = () => {
        //get what the user last drew
        const whatTheUserLastDrew =
            this.state.whatUserLastDrew.length > 0
                ? this.state.whatUserLastDrew[
                      this.state.whatUserLastDrew.length - 1
                  ]
                : '';

        //if the user last drew a line or circle, remove from All Drawings
        if (
            this.state.allDrawings.length > 0 &&
            (whatTheUserLastDrew === DrawType.Line ||
                whatTheUserLastDrew === DrawType.Circle)
        ) {
            let drawings = this.state.allDrawings;
            drawings.pop();

            let allWhatUserDrew = this.state.whatUserLastDrew;
            allWhatUserDrew.pop();

            this.setState({
                allDrawings: [...drawings],
                whatUserLastDrew: [...allWhatUserDrew],
            });
        } else if (
            this.state.allDrawings.length > 0 &&
            whatTheUserLastDrew.ActionType === DrawType.UpdateCircleSize
        ) {
            const currentSelectedIndex =
                whatTheUserLastDrew.ActionInfo.ElementIndex;
            const previousCircleProps =
                whatTheUserLastDrew.ActionInfo.PreviousCircleProps;

            //build the new Circle Element using New Radius and Props of the former Circle
            const newCircleElement = (
                <Circle
                    cx={previousCircleProps.cx}
                    cy={previousCircleProps.cy}
                    r={previousCircleProps.r}
                    onLongPress={() => {
                        this.OnLongPressCircle(currentSelectedIndex);
                    }}
                    delayLongPress={600}
                    stroke={previousCircleProps.stroke}
                    strokeWidth={previousCircleProps.strokeWidth}
                />
            );

            const newDrawings = [...this.state.allDrawings];
            newDrawings[currentSelectedIndex] = newCircleElement;

            this.setState({
                allDrawings: newDrawings,
            });

            //this is no longer what the user last drew, so Pop
            let allWhatUserDrew = this.state.whatUserLastDrew;
            allWhatUserDrew.pop();
        } else {
            //if it was a Pencil, remove from the strokes
            if (
                this.state.currentPoints.length > 0 ||
                this.state.previousStrokes.length < 1
            ) {
                return;
            }

            let strokes = this.state.previousStrokes;
            strokes.pop();

            this.state.pen.rewindStroke();

            let allWhatUserDrew = this.state.whatUserLastDrew;
            allWhatUserDrew.pop();

            this.setState(
                {
                    previousStrokes: [...strokes],
                    currentPoints: [],
                    whatUserLastDrew: [...allWhatUserDrew],
                },
                () => {
                    this._onChangeStrokes([...strokes]);
                },
            );
        }
    };

    /** When User Presses the Clear Button */
    clear = () => {
        this.setState(
            {
                previousStrokes: [],
                currentPoints: [],
                newStroke: [],
                allDrawings: [],
                whatUserLastDrew: [],
            },
            () => {
                this._onChangeStrokes([]);
            },
        );

        this.state.pen.clear();
    };

    updateStrokes(data = {}) {
        requestAnimationFrame(() => {
            this.setState({...data});
        });
    }

    /** Update the Drawing Type [Pencil, Line, Circle] */
    updateCurrentDrawingType = (newDrawingType) => {
        this.setState({
            drawingToolType: newDrawingType,
        });
    };

    /** when user touches and Moves on the screen, for Pencil Drawing Type */
    pencilDrawOnTouch = (evt) => {
        let x, y, timestamp;
        [x, y, timestamp] = [
            evt.nativeEvent.locationX,
            evt.nativeEvent.locationY,
            evt.nativeEvent.timestamp,
        ];

        this.setState({
            previousStrokes: this.state.previousStrokes,
        });
    };

    /** when User Touches Screen, for Line and Circle Drawing Type */
    shapeDrawOnResponderGrant = (evt) => {
        let x, y;
        [x, y] = [evt.nativeEvent.locationX, evt.nativeEvent.locationY];
        this.setState({
            startX: x,
            startY: y,
        });
    };

    /** when User Moves on the Screen, for Line and Circle Drawing Type */
    shapeDrawOnResponderMove = (evt) => {
        let x, y;
        [x, y] = [evt.nativeEvent.locationX, evt.nativeEvent.locationY];
        this.setState({
            endX: x,
            endY: y,
        });
    };

    /** When User releases on Screen, for line Drawing Type */
    lineDrawOnResponderRelease = () => {
        //if user touched and released on screen, don't draw any lines
        if (this.state.endX === 0 || this.state.endY === 0) {
            return;
        }

        //build the line element
        const newLineElement = (
            <Line
                x1={this.state.startX}
                y1={this.state.startY}
                x2={this.state.endX}
                y2={this.state.endY}
                stroke={this.props.color || '#000000'}
                strokeWidth={this.props.strokeWidth || 4}
            />
        );

        this.setState({
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            allDrawings: [...this.state.allDrawings, newLineElement], //add the new line element to allDrawings
            whatUserLastDrew: [...this.state.whatUserLastDrew, DrawType.Line], //user last drew a line on screen
        });
    };

    /** When User releases on Screen, when drawing a Circle */
    circleDrawOnResponderRelease = () => {
        const circleRadius = this.GetCircleRadiusFromState();

        //if user touched and released on screen without moving, don't draw any Circles
        if (circleRadius === 0) {
            return;
        }

        //get the arrayLength, as this would be the index of the Circle that is about to be added to the Array
        const arrayLength = this.state.allDrawings.length;

        //build the Circle element
        const newCircleElement = (
            <Circle
                cx={this.state.startX}
                cy={this.state.startY}
                r={circleRadius}
                onLongPress={() => {
                    this.OnLongPressCircle(arrayLength); //pass the ArrayLength as index of the Circle.
                }}
                delayLongPress={600}
                stroke={this.props.color || '#000000'}
                strokeWidth={this.props.strokeWidth || 4}
            />
        );

        this.setState({
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            allDrawings: [...this.state.allDrawings, newCircleElement], //add the new Circle element to allDrawings
            whatUserLastDrew: [...this.state.whatUserLastDrew, DrawType.Circle], //user last drew a Circle on screen
        });
    };

    /** When User releases on Screen, for Pencil Drawing Type */
    pencilDrawResponderRelease = () => {
        // let strokes = this.state.previousStrokes;
        if (this.state.currentPoints.length < 1) {
            return;
        }

        let points = this.state.currentPoints;
        if (points.length === 1) {
            let p = points[0];
            // eslint-disable-next-line radix
            let distance = parseInt(Math.sqrt(this.props.strokeWidth || 4) / 2);
        }

        let newElement = {
            type: 'Path',
            attributes: {
                d: this.state.pen.pointsToSvg(
                    points,
                    this.props.simplifyTolerance,
                    this.props.lineGenerator,
                ),
                stroke: this.props.color || '#000000',
                strokeWidth: this.props.strokeWidth || 4,
                fill: 'none',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
            },
        };

        this.state.pen.addStroke(points);

        this.currentPoints = [];

        InteractionManager.runAfterInteractions(() => {
            this.setState(
                {
                    previousStrokes: [
                        ...this.state.previousStrokes,
                        newElement,
                    ],
                    currentPoints: this.currentPoints || [],
                    whatUserLastDrew: [
                        ...this.state.whatUserLastDrew,
                        DrawType.Pencil,
                    ], //add Pencil to what user Drew on Screen
                },
                () => {
                    requestAnimationFrame(() => {
                        this._onChangeStrokes(this.state.previousStrokes);
                    });
                },
            );
        });
    };

    _onChangeStrokes = (strokes) => {
        if (this.props.onChangeStrokes) {
            requestAnimationFrame(() => {
                this.props.onChangeStrokes(strokes);
            });
        }
    };

    _onLayoutContainer = (e) => {
        this.state.pen.setOffset(e.nativeEvent.layout);
        this._layout = e.nativeEvent.layout;
    };

    _renderSvgElement = (e, tracker) => {
        if (e.type === 'Path') {
            return <Path {...e.attributes} key={tracker} />;
        }

        return null;
    };

    exportToSVG = () => {
        const strokes = [...this.state.previousStrokes];
        return convertStrokesToSvg(strokes, this._layout);
    };

    /** When User LongPresses on the Circle */
    OnLongPressCircle = (elementIndex) => {
        const circleElement = this.state.allDrawings[elementIndex];

        //update drawing Type to circle
        this.updateCurrentDrawingType(DrawType.Circle);

        //when the user selects the circle for Updating
        //store the current Props of the Circle for Undo
        const updateCircleNewAction = {
            ActionType: DrawType.UpdateCircleSize,
            ActionInfo: {
                ElementIndex: elementIndex,
                PreviousCircleProps: {
                    r: circleElement.props.r,
                    cx: circleElement.props.cx,
                    cy: circleElement.props.cy,
                    stroke: circleElement.props.stroke,
                    strokeWidth: circleElement.props.strokeWidth,
                }, //store the needed circle props in State for Undo
            },
        };

        this.setState({
            didUserLongPressCircle: true,
            currentUserSelectedCircle: {
                circleElementIndex: elementIndex,
                circleElement: circleElement,
            },
            whatUserLastDrew: [
                ...this.state.whatUserLastDrew,
                updateCircleNewAction,
            ], //user begins to update circle size.
        });

        //when user seelects the circle for update

        //To-Do: Show Visual Feedback that the Circle has been selected.
    };

    /**when user is zooming on Circle after LongPress */
    handleZoomOfCircle = (event) => {
        const touches = event.nativeEvent.touches;
        //if two touches on screen, we have a pinch-to-zoom movement.
        if (touches.length >= 2) {
            const [touch1, touch2] = touches;

            //get the element of the current Selected Circle
            const currentSelectedIndex = this.state.currentUserSelectedCircle
                .circleElementIndex;

            //get the Circle itself.
            const currentSelectedElement = this.state.currentUserSelectedCircle
                .circleElement;

            //calculate the Radius of the Circle
            const circleRadius = this.GetCircleRadius(
                touch1.pageX,
                touch1.pageY,
                touch2.pageX,
                touch2.pageY,
            );

            //build the new Circle Element using New Radius and Props of the former Circle
            const newCircleElement = (
                <Circle
                    cx={currentSelectedElement.props.cx}
                    cy={currentSelectedElement.props.cy}
                    r={circleRadius}
                    onLongPress={() => {
                        this.OnLongPressCircle(currentSelectedIndex);
                    }}
                    delayLongPress={600}
                    stroke={currentSelectedElement.props.stroke}
                    strokeWidth={currentSelectedElement.props.strokeWidth}
                />
            );

            const newDrawings = [...this.state.allDrawings];
            newDrawings[currentSelectedIndex] = newCircleElement;

            this.setState({
                allDrawings: newDrawings,
            });
        }
    };

    /** when user releases hand from screen, and is done zooming */
    handleCircleZoomComplete = () => {
        this.setState({
            didUserLongPressCircle: false,
            currentUserSelectedCircle: {},
            drawingToolType: '', //after user is finished zooming, don't let his touch draw another Circle.
        });
    };

    /** Get the Radius of the Circle (using Values from State) that's been drawn*/
    GetCircleRadiusFromState = () => {
        if (
            this.state.endX === 0 ||
            this.state.endY === 0 ||
            this.state.startX === 0 ||
            this.state.startY === 0
        ) {
            return 0;
        }
        const circleRadius = this.GetCircleRadius(
            this.state.startX,
            this.state.startY,
            this.state.endX,
            this.state.endY,
        );
        return circleRadius;
    };

    /** Get the Radius of Circle */
    GetCircleRadius = (startX, startY, endX, endY) => {
        const circleRadius = Math.sqrt(
            Math.pow(startX - endX, 2) + Math.pow(startY - endY, 2),
        );
        return circleRadius;
    };

    /** When user touches the screen **/
    onResponderGrant(evt) {
        switch (this.state.drawingToolType) {
            case DrawType.Pencil:
                this.pencilDrawOnTouch(evt);
                break;
            case DrawType.Line:
            case DrawType.Circle:
                this.shapeDrawOnResponderGrant(evt);
                break;
            default:
                break;
        }
    }

    /** When user is moving on the screeen */
    onResponderMove(evt) {
        if (this.state.didUserLongPressCircle) {
            this.handleZoomOfCircle(evt);
        } else {
            switch (this.state.drawingToolType) {
                case DrawType.Pencil:
                    this.pencilDrawOnTouch(evt);
                    break;
                case DrawType.Line:
                case DrawType.Circle:
                    this.shapeDrawOnResponderMove(evt);
                    break;
                default:
                    break;
            }
        }
    }

    /** When User releases hand from the Screen */
    onResponderRelease() {
        if (this.state.didUserLongPressCircle) {
            this.handleCircleZoomComplete();
        } else {
            switch (this.state.drawingToolType) {
                case DrawType.Pencil:
                    this.pencilDrawResponderRelease();
                    break;
                case DrawType.Line:
                    this.lineDrawOnResponderRelease();
                    break;
                case DrawType.Circle:
                    this.circleDrawOnResponderRelease();
                    break;
                default:
                    break;
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <View
                    onLayout={this._onLayoutContainer}
                    style={[styles.drawContainer, this.props.containerStyle]}>
                    <View
                        style={styles.svgContainer}
                        {...this._panResponder.panHandlers}>
                        <Svg style={styles.drawSurface}>
                            <G>
                                {this.state.previousStrokes.map(
                                    (stroke, index) => {
                                        return this._renderSvgElement(
                                            stroke,
                                            index,
                                        );
                                    },
                                )}
                                <Path
                                    key={this.state.previousStrokes.length}
                                    d={this.state.pen.pointsToSvg(
                                        this.state.currentPoints,
                                        this.props.simplifyTolerance,
                                        this.props.lineGenerator,
                                        false,
                                    )}
                                    stroke={this.props.color || '#000000'}
                                    strokeWidth={this.props.strokeWidth || 4}
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* This shows the Line and Circle, after the User Releases Touch on the Screen */}
                                {this.state.allDrawings.map(
                                    (drawing, index) => {
                                        return <G key={index}>{drawing}</G>;
                                    },
                                )}

                                {/* Show Visual Feedback as the User is drawing a Line on the Screen */}
                                {this.state.drawingToolType === DrawType.Line &&
                                    this.state.endX > 0 &&
                                    this.state.endY > 0 && (
                                        <Line
                                            x1={this.state.startX}
                                            y1={this.state.startY}
                                            x2={this.state.endX}
                                            y2={this.state.endY}
                                            stroke={
                                                this.props.color || '#000000'
                                            }
                                            strokeWidth={
                                                this.props.strokeWidth || 4
                                            }
                                        />
                                    )}

                                {/* Show Visual Feedback as the User is drawing a Circle on the Screen */}
                                {this.state.drawingToolType ===
                                    DrawType.Circle &&
                                    this.GetCircleRadiusFromState() > 0 && (
                                        <Circle
                                            cx={this.state.startX}
                                            cy={this.state.startY}
                                            r={this.GetCircleRadiusFromState()}
                                            stroke={
                                                this.props.color || '#000000'
                                            }
                                            strokeWidth={
                                                this.props.strokeWidth || 4
                                            }
                                        />
                                    )}
                            </G>
                        </Svg>

                        {this.props.children}
                    </View>
                </View>

                <Bar
                    currentColor={this.props.color}
                    selectColor={this.props.updateColor}
                    undoAction={() => {
                        this.rewind();
                    }}
                    clearAction={() => {
                        this.clear();
                    }}
                    strokeWidth={this.props.strokeWidth}
                    updateStrokeWidth={this.props.updateStrokeWidth}
                    currentDrawingType={this.state.drawingToolType}
                    updateCurrentDrawingType={this.updateCurrentDrawingType}
                    captureScreenShot={CaptureAndShareScreenshot}
                />
            </React.Fragment>
        );
    }
}

let styles = StyleSheet.create({
    drawContainer: {
        flex: 1,
        display: 'flex',
    },
    svgContainer: {
        flex: 1,
    },
    drawSurface: {
        flex: 1,
    },
});
