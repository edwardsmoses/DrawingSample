import React from 'react';

import {View, StyleSheet} from 'react-native';

import Pad from './src/view/pad';

const App = () => {
  return (
    <View style={styles.MainContainer}>
      <Pad
        strokes={[]}
        containerStyle={{backgroundColor: 'rgba(0,0,0,0.01)'}}
        rewind={(undo: any) => {}}
        clear={(clear: any) => {}}
        color={'#000000'}
        strokeWidth={4}
        onChangeStrokes={(strokes: any) => console.log(strokes)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },

  childView: {
    flex: 1,
    overflow: 'hidden',
  },
  point: {
    height: 22,
    width: 22,
    marginTop: 5,
    position: 'absolute',
    borderRadius: 14,
    backgroundColor: '#afeeee',
  },
});

export default App;
