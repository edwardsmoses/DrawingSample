import React from 'react';

import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

type ClearButtonProps = {
    clearAction(): void;
};

export const ClearButton = (props: ClearButtonProps) => {
    const {clearAction} = props;
    return (
        <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => {
                clearAction();
            }}>
            <View>
                <Text>Clear</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonStyle: {
        marginHorizontal: 10,
    },
});
