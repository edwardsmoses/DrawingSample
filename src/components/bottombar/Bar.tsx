import React from 'react';

import {StyleSheet, View} from 'react-native';
import {ColorSelector} from './tools/ColorSelector';

type BarProps = {
    selectColor(color: string): void;
    undoAction(): void;
};

export const Bar = (props: BarProps) => {
    const {selectColor} = props;

    return (
        <View style={styles.containerStyle}>
            <ColorSelector onSelectColor={selectColor} />
        </View>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: '#fff',
        width: '100%',
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
    },
});
