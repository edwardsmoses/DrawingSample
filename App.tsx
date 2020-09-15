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
  StatusBar,
  PanResponder,
  Image,
  Dimensions,
} from 'react-native';

import Svg, {Rect} from 'react-native-svg';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const App = () => {
  const [panState, setpanState] = React.useState({
    touchX: 100,
    touchY: 5,
    width:200,
    heigt:50,
  });

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Svg width="200" height="60">
                <Rect
                  x={panState.touchX}
                  y={panState.touchY}
                  width={panState.width}
                  height={panState.width}
                  fill="rgb(0,0,255)"
                  strokeWidth="3"
                  stroke="rgb(0,0,0)"
                />
              </Svg>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
