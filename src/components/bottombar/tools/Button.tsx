import React from 'react';

import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

type ButtonProps = {
    text: string;
    buttonAction(): void;
};

export const Button = (props: ButtonProps) => {
    const {buttonAction, text} = props;
    return (
        <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => {
                buttonAction();
            }}>
            <View>
                <Text>{text}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonStyle: {
        marginHorizontal: 10,
    },
});
