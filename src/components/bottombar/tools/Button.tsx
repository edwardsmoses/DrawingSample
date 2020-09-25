import React from 'react';

import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

type ButtonProps = {
    text: string;
    buttonAction(): void;
    buttonStyle: {};
};

export const Button = (props: ButtonProps) => {
    const {buttonAction, text, buttonStyle} = props;
    return (
        <TouchableOpacity
            style={[styles.buttonStyle, buttonStyle]}
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
