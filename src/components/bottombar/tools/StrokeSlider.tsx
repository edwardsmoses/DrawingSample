import React from 'react';

import {StyleSheet} from 'react-native';

import Slider from '@react-native-community/slider';

type SliderProps = {
    strokeWidth: number;
    updateStrokeWidth(strokeWidth: number): void;
};

export const StrokeSlider = (props: SliderProps) => {
    const {strokeWidth, updateStrokeWidth} = props;
    return (
        <Slider
            style={styles.sliderStyle}
            step={1}
            minimumValue={1}
            maximumValue={30}
            value={strokeWidth}
            onValueChange={(value) => {
                updateStrokeWidth(value);
            }}
        />
    );
};

const styles = StyleSheet.create({
    sliderStyle: {
        width: 150,
        height: 40,
    },
});
