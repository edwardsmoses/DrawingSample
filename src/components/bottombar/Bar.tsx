import React from 'react';

import {StyleSheet, View} from 'react-native';
import {ColorSelector} from './tools/ColorSelector';

export const Bar = () => {
    return (
        <View style={styles.containerStyle}>
            <ColorSelector />
        </View>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: '#fff',
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    },
});
