import React from 'react';

import {StyleSheet, View} from 'react-native';

export const ColorSelector = () => {
    return (
        <View style={styles.containerStyle}>
            <View style={styles.circleButtonStyle} />
        </View>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        alignSelf: 'flex-end',
    },
    circleButtonStyle: {
        height: 22,
        width: 22,
        marginTop: 5,
        borderRadius: 50,
        backgroundColor: 'red',
    },
});
