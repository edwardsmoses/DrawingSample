import React from 'react';

import {View, PanResponder} from 'react-native';

export const Canvas = () => {
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderMove: (evt, gestureState) => {},
        onPanResponderRelease: (evt, gestureState) => {},
    });

    return <View />;
};
