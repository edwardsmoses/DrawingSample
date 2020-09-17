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
    },
});
