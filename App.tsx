import React from 'react';

import {View, StyleSheet, Image} from 'react-native';

import {Canvas} from './src/components/canvas/';

const App = () => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={require('./src/assets/playingGolf.png')}
          style={styles.backgroundImage}
        />
      </View>

      <Canvas />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  padView: {
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
});

export default App;
