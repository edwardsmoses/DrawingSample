/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  ScrollView,
  View,
  Text,
  StatusBar,
  PanResponder,
  Image,
  Animated,
  Dimensions,
} from 'react-native';

import Svg, {Rect, Line} from 'react-native-svg';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const App = () => {
  const [panState, setpanState] = React.useState({
    startTouchX: 0,
    startTouchY: 0,

    endTouchX: 0,
    endTouchY: 0,
  });

  const appPanResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (event, gestureState) => true,
        onStartShouldSetPanResponderCapture: (event, gestureState) => {
          if (event && event.nativeEvent) {
            setpanState((appState) => ({
              ...appState,
              startTouchX: event.nativeEvent.locationX,
              startTouchY: event.nativeEvent.locationY,
            }));
          }
          return true;
        },
        onMoveShouldSetPanResponder: (event, gestureState) => false,
        onMoveShouldSetPanResponderCapture: (event, gestureState) => false,
        onPanResponderGrant: (event, gestureState) => false,
        onPanResponderMove: (event, gestureState) => {},
        onPanResponderRelease: (event, gestureState) => {
          if (event && event.nativeEvent) {
            setpanState((appState) => ({
              ...appState,
              endTouchX: event.nativeEvent.locationX,
              endTouchY: event.nativeEvent.locationY,
            }));
          }
        },
      }),
    [],
  );

  const pan = React.useRef(new Animated.ValueXY()).current;

  const panResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
        if (evt && evt.nativeEvent) {
          setpanState((appState) => ({
            ...appState,
            startTouchX: evt.nativeEvent.locationX,
            startTouchY: evt.nativeEvent.locationY,
          }));
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        if (evt && evt.nativeEvent) {
          setpanState((appState) => ({
            ...appState,
            endTouchX: evt.nativeEvent.locationX,
            endTouchY: evt.nativeEvent.locationY,
          }));
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    }),
  ).current;

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.MainContainer}>
        <View style={styles.childView}>
          <Svg height={height} width={width} style={styles.svgStyle}>
            <Line
              x1={panState.startTouchX}
              y1={panState.startTouchY}
              x2={panState.endTouchX}
              y2={panState.endTouchY}
              stroke="red"
              strokeWidth="8"
            />
          </Svg>
          <View style={styles.panView} {...panResponder.panHandlers} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  svgStyle: {
    position: 'absolute',
  },
  panView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  MainContainer: {
    flex: 1,
  },

  childView: {
    flex: 1,
    overflow: 'hidden',
  },
});

export default App;
