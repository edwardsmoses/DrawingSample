import React from 'react';
import {View, PanResponder, StyleSheet, InteractionManager} from 'react-native';
import Svg, {G, Path, Circle, Rect, Line} from 'react-native-svg';
import Pen from '../tools/pen';
import Point from '../tools/point';

import {Bar} from '../bottombar/Bar';

import humps from 'humps';
import {debounce} from 'lodash';

import * as DrawType from '../tools/DrawType';

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
            currentPoints: [],
            previousStrokes: this.props.strokes || [],
            newStroke: [],
            pen: new Pen(),
            drawingToolType: DrawType.Pencil, //hold the drawingType (Pencil, Circle, Line)
            startX: 0, //hold the startX of when user Touches Screen
            startY: 0, //hold the startY of when user Touches Screen
            endX: 0, //hold the endX of when user is moving on Screen
            endY: 0, //hold the endY of when user is moving on Screen
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
        if (
            this.state.currentPoints.length > 0 ||
            this.state.previousStrokes.length < 1
        ) {
            return;
        }
        let strokes = this.state.previousStrokes;
        strokes.pop();

        this.state.pen.rewindStroke();

        this.setState(
            {
                previousStrokes: [...strokes],
                currentPoints: [],
            },
            () => {
                this._onChangeStrokes([...strokes]);
            },
        );
    };

    /** When User Presses the Clear Button */
    clear = () => {
        this.setState(
            {
                previousStrokes: [],
                currentPoints: [],
                newStroke: [],
                allDrawings: [],
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

    /** when user touches the screen **/
    onResponderGrant(evt) {
        switch (this.state.drawingToolType) {
            case DrawType.Pencil:
                this.pencilDrawOnTouch(evt);
                break;
            case DrawType.Line:
                this.lineDrawOnResponderGrant(evt);
                break;
            case DrawType.Circle:
                this.circleDrawOnTouch(evt);
                break;
            default:
                break;
        }
    }

    /** when user is moving on the screeen */
    onResponderMove(evt) {
        switch (this.state.drawingToolType) {
            case DrawType.Pencil:
                this.pencilDrawOnTouch(evt);
                break;
            case DrawType.Line:
                this.lineDrawOnResponderMove(evt);
                break;
            case DrawType.Circle:
                this.circleDrawOnTouch(evt);
                break;
            default:
                break;
        }
    }

    /** Update the Drawing Type [Pencil, Line, Circle] */
    updateCurrentDrawingType = (newDrawingType) => {
        console.log(newDrawingType);
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
        let newPoint = new Point(x, y, timestamp);
        let newCurrentPoints = this.state.currentPoints;
        newCurrentPoints.push(newPoint);

        this.setState({
            previousStrokes: this.state.previousStrokes,
            currentPoints: newCurrentPoints,
        });
    };

    /** when User Touches Screen, for Line Drawing Type */
    lineDrawOnResponderGrant = (evt) => {
        let x, y, timestamp;
        [x, y, timestamp] = [
            evt.nativeEvent.locationX,
            evt.nativeEvent.locationY,
            evt.nativeEvent.timestamp,
        ];
        this.setState({
            startX: x,
            startY: y,
        });
    };

    /** when User Moves on the Screen, for Line Drawing Type */
    lineDrawOnResponderMove = (evt) => {
        let x, y, timestamp;
        [x, y, timestamp] = [
            evt.nativeEvent.locationX,
            evt.nativeEvent.locationY,
            evt.nativeEvent.timestamp,
        ];
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
        });
    };

    circleDrawOnTouch = (evt) => {
        console.log('CircleTouch', evt);
    };

    /** When User releases on Screen, for Pencil Drawing Type */
    pencilDrawResponderRelease = () => {
        let strokes = this.state.previousStrokes;
        if (this.state.currentPoints.length < 1) {
            return;
        }

        let points = this.state.currentPoints;
        if (points.length === 1) {
            let p = points[0];
            let distance = parseInt(Math.sqrt(this.props.strokeWidth || 4) / 2);
            points.push(new Point(p.x + distance, p.y + distance, p.time));
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
                },
                () => {
                    requestAnimationFrame(() => {
                        this._onChangeStrokes(this.state.previousStrokes);
                    });
                },
            );
        });
    };

    circleDrawResponderRelease = () => {
        console.log('Released Circle');
    };

    onResponderRelease() {
        switch (this.state.drawingToolType) {
            case DrawType.Pencil:
                this.pencilDrawResponderRelease();
                break;
            case DrawType.Line:
                this.lineDrawOnResponderRelease();
                break;
            case DrawType.Circle:
                this.circleDrawResponderRelease();
                break;
            default:
                break;
        }
    }

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
                                <Circle
                                    cx="50"
                                    cy="50"
                                    r="50"
                                    stroke={this.props.color || '#000000'}
                                    strokeWidth={this.props.strokeWidth || 4}
                                />

                                {/* This shows the Line and Circle on the Screen */}
                                {this.state.allDrawings.map(
                                    (drawing, index) => {
                                        return <G key={index}>{drawing}</G>;
                                    },
                                )}
                                <Rect
                                    x="100"
                                    y="100"
                                    width="70"
                                    height="70"
                                    stroke={this.props.color || '#000000'}
                                    strokeWidth={this.props.strokeWidth || 4}
                                />

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
