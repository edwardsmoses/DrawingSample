import React from 'react';

import {StyleSheet, View} from 'react-native';

export const ColorSelector = () => {
    return (
        <View>
            <View style={styles.circleButtonStyle} />
        </View>
    );
};

const styles = StyleSheet.create({
    circleButtonStyle: {
        height: 22,
        width: 22,
        marginTop: 5,
        borderRadius: 50,
        backgroundColor: 'red',
    },
});
